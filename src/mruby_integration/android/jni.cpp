#include "mruby_integration/android/jni.hpp"

// NDK always defines __ANDROID__ for Android targets; __NDK_MAJOR__ needs extra headers.
#if defined(__ANDROID__) || defined(__NDK_MAJOR__)

#include <jni.h>

namespace {

JavaVM* g_vm = nullptr;
jclass g_game_loader = nullptr;
jmethodID g_set_orientation = nullptr;
jmethodID g_get_orientation = nullptr;
jmethodID g_get_accel = nullptr;
jmethodID g_get_gyro = nullptr;
jmethodID g_get_mag = nullptr;
jmethodID g_has_accel = nullptr;
jmethodID g_has_gyro = nullptr;
jmethodID g_has_mag = nullptr;
jmethodID g_get_safe_area = nullptr;

auto jni_env() -> JNIEnv*
{
  if (g_vm == nullptr) {
    return nullptr;
  }

  JNIEnv* env = nullptr;
  const jint status = g_vm->GetEnv(reinterpret_cast<void**>(&env), JNI_VERSION_1_6);
  if (status == JNI_OK) {
    return env;
  }
  if (status == JNI_EDETACHED) {
    if (g_vm->AttachCurrentThread(&env, nullptr) != 0) {
      return nullptr;
    }
    return env;
  }
  return nullptr;
}

auto copy_float3(JNIEnv* env, jfloatArray arr, float* x, float* y, float* z) -> bool
{
  if (arr == nullptr || env->GetArrayLength(arr) < 3) {
    if (arr != nullptr) {
      env->DeleteLocalRef(arr);
    }
    return false;
  }
  jfloat buf[3];
  env->GetFloatArrayRegion(arr, 0, 3, buf);
  env->DeleteLocalRef(arr);
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return false;
  }
  *x = buf[0];
  *y = buf[1];
  *z = buf[2];
  return true;
}

} // namespace

extern "C" JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM* vm, void*)
{
  g_vm = vm;

  JNIEnv* env = nullptr;
  if (vm->GetEnv(reinterpret_cast<void**>(&env), JNI_VERSION_1_6) != JNI_OK) {
    return JNI_ERR;
  }

  jclass local = env->FindClass("com/raylib/game/GameLoader");
  if (local == nullptr) {
    return JNI_ERR;
  }

  g_game_loader = static_cast<jclass>(env->NewGlobalRef(local));
  env->DeleteLocalRef(local);
  if (g_game_loader == nullptr) {
    return JNI_ERR;
  }

  g_set_orientation = env->GetStaticMethodID(g_game_loader, "setOrientation", "(I)V");
  g_get_orientation = env->GetStaticMethodID(g_game_loader, "getOrientation", "()I");
  g_get_accel = env->GetStaticMethodID(g_game_loader, "getAccelerometer", "()[F");
  g_get_gyro = env->GetStaticMethodID(g_game_loader, "getGyroscope", "()[F");
  g_get_mag = env->GetStaticMethodID(g_game_loader, "getMagnetometer", "()[F");
  g_has_accel = env->GetStaticMethodID(g_game_loader, "hasAccelerometer", "()Z");
  g_has_gyro = env->GetStaticMethodID(g_game_loader, "hasGyroscope", "()Z");
  g_has_mag = env->GetStaticMethodID(g_game_loader, "hasMagnetometer", "()Z");
  g_get_safe_area = env->GetStaticMethodID(g_game_loader, "getSafeAreaInsets", "()[I");

  if (g_set_orientation == nullptr || g_get_orientation == nullptr || g_get_accel == nullptr ||
      g_get_gyro == nullptr || g_get_mag == nullptr || g_has_accel == nullptr ||
      g_has_gyro == nullptr || g_has_mag == nullptr || g_get_safe_area == nullptr) {
    return JNI_ERR;
  }

  return JNI_VERSION_1_6;
}

bool taylor_android_set_orientation(int orientation)
{
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_set_orientation == nullptr) {
    return false;
  }
  env->CallStaticVoidMethod(g_game_loader, g_set_orientation, orientation);
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return false;
  }
  return true;
}

int taylor_android_get_orientation()
{
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_get_orientation == nullptr) {
    return TaylorAndroidOrientation::LANDSCAPE;
  }
  const jint value = env->CallStaticIntMethod(g_game_loader, g_get_orientation);
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return TaylorAndroidOrientation::LANDSCAPE;
  }
  return static_cast<int>(value);
}

void taylor_android_get_accelerometer(float* x, float* y, float* z)
{
  *x = *y = *z = 0.0f;
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_get_accel == nullptr) {
    return;
  }
  auto arr = static_cast<jfloatArray>(env->CallStaticObjectMethod(g_game_loader, g_get_accel));
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return;
  }
  copy_float3(env, arr, x, y, z);
}

void taylor_android_get_gyroscope(float* x, float* y, float* z)
{
  *x = *y = *z = 0.0f;
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_get_gyro == nullptr) {
    return;
  }
  auto arr = static_cast<jfloatArray>(env->CallStaticObjectMethod(g_game_loader, g_get_gyro));
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return;
  }
  copy_float3(env, arr, x, y, z);
}

void taylor_android_get_magnetometer(float* x, float* y, float* z)
{
  *x = *y = *z = 0.0f;
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_get_mag == nullptr) {
    return;
  }
  auto arr = static_cast<jfloatArray>(env->CallStaticObjectMethod(g_game_loader, g_get_mag));
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return;
  }
  copy_float3(env, arr, x, y, z);
}

bool taylor_android_has_accelerometer()
{
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_has_accel == nullptr) {
    return false;
  }
  const jboolean v = env->CallStaticBooleanMethod(g_game_loader, g_has_accel);
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return false;
  }
  return v == JNI_TRUE;
}

bool taylor_android_has_gyroscope()
{
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_has_gyro == nullptr) {
    return false;
  }
  const jboolean v = env->CallStaticBooleanMethod(g_game_loader, g_has_gyro);
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return false;
  }
  return v == JNI_TRUE;
}

bool taylor_android_has_magnetometer()
{
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_has_mag == nullptr) {
    return false;
  }
  const jboolean v = env->CallStaticBooleanMethod(g_game_loader, g_has_mag);
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return false;
  }
  return v == JNI_TRUE;
}

void taylor_android_get_safe_area(int out[4])
{
  out[0] = out[1] = out[2] = out[3] = 0;
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_get_safe_area == nullptr) {
    return;
  }
  auto arr = static_cast<jintArray>(env->CallStaticObjectMethod(g_game_loader, g_get_safe_area));
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return;
  }
  if (arr == nullptr || env->GetArrayLength(arr) < 4) {
    if (arr != nullptr) env->DeleteLocalRef(arr);
    return;
  }
  jint buf[4];
  env->GetIntArrayRegion(arr, 0, 4, buf);
  env->DeleteLocalRef(arr);
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return;
  }
  out[0] = buf[0];
  out[1] = buf[1];
  out[2] = buf[2];
  out[3] = buf[3];
}

// UI thread → enqueue only; Ruby runs later in Window.begin_drawing.
extern "C" JNIEXPORT void JNICALL __attribute__((used, visibility("default")))
Java_com_raylib_game_GameLoader_nativeOnOrientationChange(JNIEnv*, jclass, jint new_orientation)
{
  taylor_window_notify_physical_orientation(static_cast<int>(new_orientation));
}

#else

bool taylor_android_set_orientation(int)
{
  return false;
}

int taylor_android_get_orientation()
{
  return TaylorAndroidOrientation::LANDSCAPE;
}

void taylor_android_get_accelerometer(float* x, float* y, float* z)
{
  *x = *y = *z = 0.0f;
}

void taylor_android_get_gyroscope(float* x, float* y, float* z)
{
  *x = *y = *z = 0.0f;
}

void taylor_android_get_magnetometer(float* x, float* y, float* z)
{
  *x = *y = *z = 0.0f;
}

bool taylor_android_has_accelerometer()
{
  return false;
}

bool taylor_android_has_gyroscope()
{
  return false;
}

bool taylor_android_has_magnetometer()
{
  return false;
}

void taylor_android_get_safe_area(int out[4])
{
  out[0] = out[1] = out[2] = out[3] = 0;
}

#endif
