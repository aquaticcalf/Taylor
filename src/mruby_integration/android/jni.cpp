#include "mruby_integration/android/jni.hpp"

// NDK always defines __ANDROID__ for Android targets; __NDK_MAJOR__ needs extra headers.
#if defined(__ANDROID__) || defined(__NDK_MAJOR__)

#include <jni.h>

namespace {

JavaVM* g_vm = nullptr;
jclass g_game_loader = nullptr;
jmethodID g_set_orientation = nullptr;
jmethodID g_get_orientation = nullptr;

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
  if (g_set_orientation == nullptr || g_get_orientation == nullptr) {
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

#else

bool taylor_android_set_orientation(int)
{
  return false;
}

int taylor_android_get_orientation()
{
  return TaylorAndroidOrientation::LANDSCAPE;
}

#endif

#if defined(__ANDROID__) || defined(__NDK_MAJOR__)

// UI thread → enqueue only; Ruby runs later in Window.begin_drawing.
extern "C" JNIEXPORT void JNICALL __attribute__((used, visibility("default")))
Java_com_raylib_game_GameLoader_nativeOnOrientationChange(JNIEnv*, jclass, jint new_orientation)
{
  taylor_window_notify_physical_orientation(static_cast<int>(new_orientation));
}

#endif
