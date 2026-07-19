# Android Platform Notes

APIs that are silently no-oped or broken on Android, and which could be fixed.

## Fixable (via JNI bridge)

| API | Problem | Fix |
|---|---|---|
| `Clipboard.text=` / `Clipboard.text` | raylib Android backend doesn't implement clipboard | Easy — JNI to `ClipboardManager.setPrimaryClip()` / `.getPrimaryClip()` |
| `Window.title=` | `SetWindowTitle` is a no-op on Android | Easy — JNI to `Activity.setTitle()` (only changes recents label) |
| `Monitor#refresh_rate` | Returns 0 or wrong value | Easy — JNI to `Display.getRefreshRate()` |
| `Monitor#name` | Returns empty/garbage | Easy — JNI to `Display.getName()` |
| `Window.toggle_fullscreen` | Already fullscreen, but could toggle immersive mode | Medium — JNI for `SYSTEM_UI_FLAG_IMMERSIVE` |
| `Window.screenshot` / `Window.to_image` | raylib doesn't implement screen capture on Android | Medium — `MediaProjection` API but needs runtime permission |
| `Key.*` (all 6 methods) | Returns false/nil — no keyboard shown | Hard — `InputMethodManager` + soft keyboard + key event forwarding |
| `Mouse.*` (some methods) | Returns false/(0,0) for physical mice | Medium — USB/BT mouse events already partially in raylib |

## Cannot Fix (Android window model doesn't support them)

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
