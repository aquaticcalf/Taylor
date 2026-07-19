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
