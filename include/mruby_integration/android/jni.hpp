#pragma once

// Android-only JNI helpers for GameLoader. Stubs on other platforms.

// Requested ActivityInfo orientation constants (subset we expose to Ruby).
namespace TaylorAndroidOrientation {
constexpr int LANDSCAPE = 0;
constexpr int PORTRAIT = 1;
constexpr int USER = 2; // :auto
constexpr int SENSOR = 4;
constexpr int SENSOR_LANDSCAPE = 6;
constexpr int SENSOR_PORTRAIT = 7;
constexpr int FULL_SENSOR = 10;
} // namespace TaylorAndroidOrientation

// Returns false if JNI is unavailable (non-Android, or activity not ready).
bool taylor_android_set_orientation(int orientation);

// Returns the Activity requested orientation, or LANDSCAPE if unavailable.
int taylor_android_get_orientation();

// Safe from any thread; Ruby is notified later on the game thread.
void taylor_window_enqueue_orientation_change(int old_code, int new_code);

// Android config-change path: tracks last physical portrait/landscape code.
void taylor_window_notify_physical_orientation(int physical_code);

// Motion sensors (latest sample). Stubs return zeros / false off Android.
void taylor_android_get_accelerometer(float* x, float* y, float* z);
void taylor_android_get_gyroscope(float* x, float* y, float* z);
void taylor_android_get_magnetometer(float* x, float* y, float* z);
bool taylor_android_has_accelerometer();
bool taylor_android_has_gyroscope();
bool taylor_android_has_magnetometer();

// Safe-area inset values from Android (top, right, bottom, left).
// Writes zeros on non-Android.
void taylor_android_get_safe_area(int out[4]);
