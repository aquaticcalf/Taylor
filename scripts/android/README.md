# Taylor Android packaging (GameActivity)

Taylor Android apps use **Jetpack GameActivity** (`androidx.games:games-activity`)
instead of `android.app.NativeActivity`. APKs are assembled with **Gradle / AGP**
(aapt2 + d8 under the hood). There is no hand-rolled aapt/dx path.

## Layout

| Path | Purpose |
|------|---------|
| `app/src/main/java/.../GameLoader.java` | Activity subclass of GameActivity |
| `AndroidManifest.xml` | Launches `GameLoader`, loads `libmain`, `appCategory=game` |
| `app/build.gradle` | AGP app module; depends on `games-activity:4.4.2` |
| `res/values/themes.xml` | Fullscreen AppCompat theme |

Native code (`libmain.so`) is built by Rake (`rakelib/android.rake`) and copied
into `app/src/main/jniLibs/arm64-v8a/` before Gradle assembles the APK.

Game name and version are injected at assemble time from `Taylor::Config`
(`-PapplicationName`, `-PversionName`). The Gradle project files stay static;
they are not generated per export.

## Build flow

1. Cross-compile Taylor: `bundle exec rake android:release:build` (inside the Android Docker image)
2. Links against `vendor/android/game-activity/lib/arm64-v8a/libgame-activity_static.a`
3. Strips `libmain.so`, then runs Gradle `:app:assembleRelease`
4. Signs the APK with `apksigner` (generates `$GAME_ROOT/raylib.keystore` if missing)

Dev keystore alias is `app` with the historical default password. Use your own
keystore for Play Store uploads.

## Vendored GameActivity

`vendor/android/game-activity/` contains:

- Prefab headers (`include/game-activity/...`)
- `libgame-activity_static.a` for `arm64-v8a`
- `games-activity-4.4.2.aar` / `classes.jar` for reference

Version: see `vendor/android/game-activity/VERSION`.
