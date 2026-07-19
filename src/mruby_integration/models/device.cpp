#include "mruby.h"
#include "mruby/class.h"
#include "mruby/variable.h"
#include "raylib.h"

#include <cmath>
#include <mutex>

#include "mruby_integration/android/jni.hpp"
#include "mruby_integration/models/device.hpp"
#include "mruby_integration/models/vector3.hpp"
#include "mruby_integration/struct_types.hpp"

#include "ruby/models/device.hpp"

struct RClass* Device_class;

static mrb_value g_shake_callback = mrb_nil_value();
static mrb_state* g_shake_callback_mrb = nullptr;
static mrb_value g_rotation_callback = mrb_nil_value();
static mrb_state* g_rotation_callback_mrb = nullptr;

struct ShakeEvent {
  float intensity;
};

struct RotationEvent {
  float pitch;
  float yaw;
  float roll;
};

static constexpr int DEVICE_QUEUE_CAP = 16;
static ShakeEvent g_shake_queue[DEVICE_QUEUE_CAP];
static int g_shake_head = 0;
static int g_shake_tail = 0;
static RotationEvent g_rot_queue[DEVICE_QUEUE_CAP];
static int g_rot_head = 0;
static int g_rot_tail = 0;
static std::mutex g_device_q_mutex;

// Shake detection state (game thread only when processing samples in getters / drain prep).
static float g_last_accel_mag = 0.0f;
static bool g_accel_have_baseline = false;
static double g_last_shake_time = 0.0;
static constexpr float SHAKE_THRESHOLD = 14.0f; // m/s^2-ish delta from quiet
static constexpr double SHAKE_COOLDOWN = 0.45;  // seconds

static float g_last_pitch = 0.0f;
static float g_last_roll = 0.0f;
static bool g_rotation_have_baseline = false;
static constexpr float ROTATION_DELTA = 0.08f; // radians (~4.5 deg)

static auto make_vector3(mrb_state* mrb, float x, float y, float z) -> mrb_value
{
  auto* v = static_cast<Vector3*>(mrb_malloc(mrb, sizeof(Vector3)));
  *v = Vector3{ x, y, z };
  return mrb_Vector3_value(mrb, v);
}

static void enqueue_shake(float intensity)
{
  std::lock_guard<std::mutex> lock(g_device_q_mutex);
  const int next = (g_shake_tail + 1) % DEVICE_QUEUE_CAP;
  if (next == g_shake_head) {
    g_shake_head = (g_shake_head + 1) % DEVICE_QUEUE_CAP;
  }
  g_shake_queue[g_shake_tail] = { intensity };
  g_shake_tail = next;
}

static void enqueue_rotation(float pitch, float yaw, float roll)
{
  std::lock_guard<std::mutex> lock(g_device_q_mutex);
  const int next = (g_rot_tail + 1) % DEVICE_QUEUE_CAP;
  if (next == g_rot_head) {
    g_rot_head = (g_rot_head + 1) % DEVICE_QUEUE_CAP;
  }
  g_rot_queue[g_rot_tail] = { pitch, yaw, roll };
  g_rot_tail = next;
}

static void process_accel_sample(float x, float y, float z)
{
  const float mag = std::sqrt(x * x + y * y + z * z);
  if (!g_accel_have_baseline) {
    g_last_accel_mag = mag;
    g_accel_have_baseline = true;
  } else {
    const float delta = std::fabs(mag - g_last_accel_mag);
    g_last_accel_mag = mag;
    const double now = GetTime();
    if (delta >= SHAKE_THRESHOLD && (now - g_last_shake_time) >= SHAKE_COOLDOWN) {
      g_last_shake_time = now;
      enqueue_shake(delta);
    }
  }

  // Pitch / roll from gravity vector (yaw left 0 without magnetometer fusion).
  const float pitch = std::atan2(-x, std::sqrt(y * y + z * z));
  const float roll = std::atan2(y, z);
  const float yaw = 0.0f;
  if (!g_rotation_have_baseline) {
    g_last_pitch = pitch;
    g_last_roll = roll;
    g_rotation_have_baseline = true;
  } else if (std::fabs(pitch - g_last_pitch) >= ROTATION_DELTA ||
             std::fabs(roll - g_last_roll) >= ROTATION_DELTA) {
    g_last_pitch = pitch;
    g_last_roll = roll;
    enqueue_rotation(pitch, yaw, roll);
  }
}

void taylor_device_drain_callbacks(mrb_state* mrb)
{
  // Sample accel every frame so shake/rotation fire without explicit polling.
  {
    float x = 0.0f, y = 0.0f, z = 0.0f;
    if (taylor_android_has_accelerometer()) {
      taylor_android_get_accelerometer(&x, &y, &z);
      process_accel_sample(x, y, z);
    }
  }

  ShakeEvent shakes[DEVICE_QUEUE_CAP];
  RotationEvent rots[DEVICE_QUEUE_CAP];
  int shake_count = 0;
  int rot_count = 0;

  {
    std::lock_guard<std::mutex> lock(g_device_q_mutex);
    while (g_shake_head != g_shake_tail && shake_count < DEVICE_QUEUE_CAP) {
      shakes[shake_count++] = g_shake_queue[g_shake_head];
      g_shake_head = (g_shake_head + 1) % DEVICE_QUEUE_CAP;
    }
    while (g_rot_head != g_rot_tail && rot_count < DEVICE_QUEUE_CAP) {
      rots[rot_count++] = g_rot_queue[g_rot_head];
      g_rot_head = (g_rot_head + 1) % DEVICE_QUEUE_CAP;
    }
  }

  if (!mrb_nil_p(g_shake_callback)) {
    for (int i = 0; i < shake_count; ++i) {
      mrb_value arg = mrb_float_value(mrb, shakes[i].intensity);
      mrb_yield_argv(mrb, g_shake_callback, 1, &arg);
      if (mrb->exc) {
        return;
      }
    }
  }

  if (!mrb_nil_p(g_rotation_callback)) {
    for (int i = 0; i < rot_count; ++i) {
      mrb_value args[3] = {
        mrb_float_value(mrb, rots[i].pitch),
        mrb_float_value(mrb, rots[i].yaw),
        mrb_float_value(mrb, rots[i].roll),
      };
      mrb_yield_argv(mrb, g_rotation_callback, 3, args);
      if (mrb->exc) {
        return;
      }
    }
  }
}

static auto mrb_Device_accelerometer(mrb_state* mrb, mrb_value) -> mrb_value
{
  float x = 0.0f, y = 0.0f, z = 0.0f;
  taylor_android_get_accelerometer(&x, &y, &z);
  process_accel_sample(x, y, z);
  return make_vector3(mrb, x, y, z);
}

static auto mrb_Device_gyroscope(mrb_state* mrb, mrb_value) -> mrb_value
{
  float x = 0.0f, y = 0.0f, z = 0.0f;
  taylor_android_get_gyroscope(&x, &y, &z);
  return make_vector3(mrb, x, y, z);
}

static auto mrb_Device_magnetometer(mrb_state* mrb, mrb_value) -> mrb_value
{
  float x = 0.0f, y = 0.0f, z = 0.0f;
  taylor_android_get_magnetometer(&x, &y, &z);
  return make_vector3(mrb, x, y, z);
}

static auto mrb_Device_accelerometer_p(mrb_state*, mrb_value) -> mrb_value
{
  return mrb_bool_value(taylor_android_has_accelerometer());
}

static auto mrb_Device_gyroscope_p(mrb_state*, mrb_value) -> mrb_value
{
  return mrb_bool_value(taylor_android_has_gyroscope());
}

static auto mrb_Device_magnetometer_p(mrb_state*, mrb_value) -> mrb_value
{
  return mrb_bool_value(taylor_android_has_magnetometer());
}

static auto mrb_Device_on_shake(mrb_state* mrb, mrb_value) -> mrb_value
{
  mrb_value block = mrb_nil_value();
  mrb_get_args(mrb, "&", &block);

  if (g_shake_callback_mrb != nullptr && !mrb_nil_p(g_shake_callback)) {
    mrb_gc_unregister(g_shake_callback_mrb, g_shake_callback);
  }

  if (mrb_nil_p(block)) {
    g_shake_callback = mrb_nil_value();
    g_shake_callback_mrb = nullptr;
    return mrb_nil_value();
  }

  g_shake_callback = block;
  g_shake_callback_mrb = mrb;
  mrb_gc_register(mrb, block);
  return block;
}

static auto mrb_Device_on_rotation(mrb_state* mrb, mrb_value) -> mrb_value
{
  mrb_value block = mrb_nil_value();
  mrb_get_args(mrb, "&", &block);

  if (g_rotation_callback_mrb != nullptr && !mrb_nil_p(g_rotation_callback)) {
    mrb_gc_unregister(g_rotation_callback_mrb, g_rotation_callback);
  }

  if (mrb_nil_p(block)) {
    g_rotation_callback = mrb_nil_value();
    g_rotation_callback_mrb = nullptr;
    return mrb_nil_value();
  }

  g_rotation_callback = block;
  g_rotation_callback_mrb = mrb;
  mrb_gc_register(mrb, block);
  return block;
}

void append_models_Device(mrb_state* mrb)
{
  Device_class = mrb_define_module(mrb, "Device");
  mrb_define_class_method(
    mrb, Device_class, "accelerometer", mrb_Device_accelerometer, MRB_ARGS_NONE());
  mrb_define_class_method(mrb, Device_class, "gyroscope", mrb_Device_gyroscope, MRB_ARGS_NONE());
  mrb_define_class_method(
    mrb, Device_class, "magnetometer", mrb_Device_magnetometer, MRB_ARGS_NONE());
  mrb_define_class_method(
    mrb, Device_class, "accelerometer?", mrb_Device_accelerometer_p, MRB_ARGS_NONE());
  mrb_define_class_method(
    mrb, Device_class, "gyroscope?", mrb_Device_gyroscope_p, MRB_ARGS_NONE());
  mrb_define_class_method(
    mrb, Device_class, "magnetometer?", mrb_Device_magnetometer_p, MRB_ARGS_NONE());
  mrb_define_class_method(mrb, Device_class, "on_shake", mrb_Device_on_shake, MRB_ARGS_OPT(1));
  mrb_define_class_method(
    mrb, Device_class, "on_rotation", mrb_Device_on_rotation, MRB_ARGS_OPT(1));

  load_ruby_models_device(mrb);
}
