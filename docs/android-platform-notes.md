# Android Platform Notes

APIs that are silently no-oped or broken on Android.

## Fixed ✓

These have been implemented via JNI bridge and now work on Android:

| API | Fix |
|---|---|
| `Clipboard.text=` / `Clipboard.text` | JNI to `ClipboardManager.setPrimaryClip()` / `.getPrimaryClip()` |
| `Window.title=` | JNI to `Activity.setTitle()` (visible in recents/task switcher) |
| `Monitor#refresh_rate` | JNI to `Display.getRefreshRate()` |
| `Monitor#name` | JNI to `Display.getName()` |
| `Window.toggle_fullscreen` | JNI to toggle immersive mode (`SYSTEM_UI_FLAG_IMMERSIVE_STICKY`) |

## Still Broken

### Fixable (via JNI bridge)

| API | Problem | Fix |
|---|---|---|
| `Window.screenshot` | `TakeScreenshot` writes relative to cwd, which is the read-only `assets` APK dir. The GPU read (`LoadImageFromScreen`) works fine. | Likely works if you pass an absolute path to internal storage. `Window.to_image` + `Image#save` with `ExportImage` already works. |
| `Key.*` (all 6 methods) | Returns false/nil — no keyboard shown | Hard — `InputMethodManager` + soft keyboard + key event forwarding |
| `Mouse.*` (some methods) | Returns false/(0,0) for physical mice | Medium — USB/BT mouse events already partially in raylib |

### Cannot Fix (Android window model doesn't support them)

| API | Reason |
|---|---|
| `Window.resolution=` | Android Activity size is fixed |
| `Window.minimum_resolution=` | No concept of min window size |
| `Window.position=` / `Window.position` | Always fullscreen, position always (0,0) |
| `Window.maximise` / `Window.minimise` / `Window.restore` | Android manages its own lifecycle |
| `Window.opacity=` | Android doesn't support per-window opacity |
| `Window.monitor=` | Single display on phones |
| `Cursor.*` (all methods) | No system cursor on Android (except USB mouse which OS handles) |
| `DroppedFiles.*` | Drag-and-drop doesn't exist on Android |
| `Window.icon=` | Android uses manifest-defined icons at build time |
| `Window.flags=*` (FULLSCREEN, RESIZABLE, etc.) | Activity model doesn't map to these concepts |
