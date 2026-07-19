# Taylor Android packaging (GameActivity)

Step 1 of Tier 3 orientation support: Taylor Android apps use **Jetpack
GameActivity** (`androidx.games:games-activity`) instead of the legacy
`android.app.NativeActivity`.

## Layout

| Path | Purpose |
|------|---------|
| `GameLoader.java` | Activity subclass of `com.google.androidgamesdk.GameActivity` |
| `AndroidManifest.xml` | Launches `GameLoader`, loads `libmain` |
| `app/build.gradle` | AGP app module; depends on `games-activity:4.4.2` |
| `res/values/themes.xml` | Fullscreen AppCompat theme |

Native code (`libmain.so`) is still built by Rake (`rakelib/android.rake`) and
copied into `app/src/main/jniLibs/arm64-v8a/` before Gradle assembles the APK.

## Build flow

1. Cross-compile Taylor: `bundle exec rake android:release:build` (inside the Android Docker image)
2. That task links against `vendor/android/game-activity/lib/arm64-v8a/libgame-activity_static.a`
3. Then runs Gradle `:app:assembleRelease` to package the GameActivity APK

## Vendored GameActivity

`vendor/android/game-activity/` contains:

- Prefab headers (`include/game-activity/...`)
- `libgame-activity_static.a` for `arm64-v8a`
- `games-activity-4.4.2.aar` / `classes.jar` for reference

Version: see `vendor/android/game-activity/VERSION`.
