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
