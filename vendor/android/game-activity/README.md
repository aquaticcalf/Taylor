# GameActivity (AGDK) for Taylor Android

Vendored from `androidx.games:games-activity:4.4.2` (Google Maven).

| Path | Contents |
|------|----------|
| `include/` | Prefab headers (`GameActivity.h`, GameActivity `native_app_glue`, GameTextInput) |
| `lib/arm64-v8a/libgame-activity_static.a` | Static library linked into `libmain.so` |
| `classes.jar` / `games-activity-4.4.2.aar` | Reference copies (Gradle still resolves the Maven dependency for Java) |
| `VERSION` | Artifact version string |

Taylor no longer uses the NDK `android_native_app_glue` / `NativeActivity` path for Android.
