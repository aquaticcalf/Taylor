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
jmethodID g_set_clipboard_text = nullptr;
jmethodID g_get_clipboard_text = nullptr;
jmethodID g_set_window_title = nullptr;
jmethodID g_get_refresh_rate = nullptr;
jmethodID g_get_monitor_name = nullptr;
jmethodID g_toggle_fullscreen = nullptr;

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

  g_set_clipboard_text = env->GetStaticMethodID(g_game_loader, "setClipboardText", "(Ljava/lang/String;)V");
  g_get_clipboard_text = env->GetStaticMethodID(g_game_loader, "getClipboardText", "()Ljava/lang/String;");
  g_set_window_title = env->GetStaticMethodID(g_game_loader, "setWindowTitle", "(Ljava/lang/String;)V");
  g_get_refresh_rate = env->GetStaticMethodID(g_game_loader, "getRefreshRate", "(I)I");
  g_get_monitor_name = env->GetStaticMethodID(g_game_loader, "getMonitorName", "(I)Ljava/lang/String;");
  g_toggle_fullscreen = env->GetStaticMethodID(g_game_loader, "toggleFullscreen", "()V");

  if (g_set_orientation == nullptr || g_get_orientation == nullptr || g_get_accel == nullptr ||
      g_get_gyro == nullptr || g_get_mag == nullptr || g_has_accel == nullptr ||
      g_has_gyro == nullptr || g_has_mag == nullptr || g_get_safe_area == nullptr ||
      g_set_clipboard_text == nullptr || g_get_clipboard_text == nullptr ||
      g_set_window_title == nullptr || g_get_refresh_rate == nullptr ||
      g_get_monitor_name == nullptr || g_toggle_fullscreen == nullptr) {
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

static auto jstring_to_cstr(JNIEnv* env, jstring js) -> const char*
{
  if (js == nullptr) {
    return nullptr;
  }
  const char* utf = env->GetStringUTFChars(js, nullptr);
  if (utf == nullptr) {
    return nullptr;
  }
  const char* dup = strdup(utf);
  env->ReleaseStringUTFChars(js, utf);
  env->DeleteLocalRef(js);
  return dup;
}

const char* taylor_android_clipboard_text()
{
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_get_clipboard_text == nullptr) {
    return nullptr;
  }
  auto js = static_cast<jstring>(env->CallStaticObjectMethod(g_game_loader, g_get_clipboard_text));
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return nullptr;
  }
  return jstring_to_cstr(env, js);
}

bool taylor_android_set_clipboard_text(const char* text)
{
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_set_clipboard_text == nullptr) {
    return false;
  }
  jstring js = env->NewStringUTF(text);
  env->CallStaticVoidMethod(g_game_loader, g_set_clipboard_text, js);
  env->DeleteLocalRef(js);
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return false;
  }
  return true;
}

bool taylor_android_set_window_title(const char* title)
{
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_set_window_title == nullptr) {
    return false;
  }
  jstring js = env->NewStringUTF(title);
  env->CallStaticVoidMethod(g_game_loader, g_set_window_title, js);
  env->DeleteLocalRef(js);
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return false;
  }
  return true;
}

int taylor_android_get_refresh_rate(int monitor_id)
{
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_get_refresh_rate == nullptr) {
    return 60;
  }
  const jint rate = env->CallStaticIntMethod(g_game_loader, g_get_refresh_rate, monitor_id);
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return 60;
  }
  return static_cast<int>(rate);
}

const char* taylor_android_get_monitor_name(int monitor_id)
{
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_get_monitor_name == nullptr) {
    return nullptr;
  }
  auto js = static_cast<jstring>(env->CallStaticObjectMethod(g_game_loader, g_get_monitor_name, monitor_id));
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return nullptr;
  }
  return jstring_to_cstr(env, js);
}

bool taylor_android_toggle_fullscreen()
{
  JNIEnv* env = jni_env();
  if (env == nullptr || g_game_loader == nullptr || g_toggle_fullscreen == nullptr) {
    return false;
  }
  env->CallStaticVoidMethod(g_game_loader, g_toggle_fullscreen);
  if (env->ExceptionCheck()) {
    env->ExceptionClear();
    return false;
  }
  return true;
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

const char* taylor_android_clipboard_text()
{
  return nullptr;
}

bool taylor_android_set_clipboard_text(const char*)
{
  return false;
}

bool taylor_android_set_window_title(const char*)
{
  return false;
}

int taylor_android_get_refresh_rate(int)
{
  return 60;
}

const char* taylor_android_get_monitor_name(int)
{
  return nullptr;
}

bool taylor_android_toggle_fullscreen()
{
  return false;
}

#endif
