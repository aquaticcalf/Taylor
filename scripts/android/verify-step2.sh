#!/usr/bin/env bash
# Verify Step 2 packaging: libmain + Gradle APK + keystore + apksigner.
# Base image has no mrbc, so we compile without EXPORT (same as smoke-libmain).
set -euo pipefail
export LANG=C.UTF-8 LC_ALL=C.UTF-8
export PATH="/ndk/android-ndk-r25b/toolchains/llvm/prebuilt/linux-x86_64/bin:/sdk/build-tools/34.0.0:${PATH}"
export GAME_ROOT="${GAME_ROOT:-/app/game}"
unset EXPORT
export RUBYOPT="-rpathname -rjson ${RUBYOPT:-}"

gem install --no-document rake 2>/dev/null || true

mkdir -p "$GAME_ROOT/assets" "$GAME_ROOT/exports/android"
printf '%s\n' 'puts :ok' > "$GAME_ROOT/game.rb"
rm -f "$GAME_ROOT/raylib.keystore"

cd /app/taylor

# Builder reads ./taylor-config.json at load time for game_name/version
CONFIG_BAK=
if [ -f taylor-config.json ]; then
  CONFIG_BAK=$(mktemp)
  cp taylor-config.json "$CONFIG_BAK"
fi
cleanup() {
  if [ -n "${CONFIG_BAK:-}" ] && [ -f "$CONFIG_BAK" ]; then
    cp "$CONFIG_BAK" taylor-config.json
    rm -f "$CONFIG_BAK"
  fi
}
trap cleanup EXIT

cat > taylor-config.json <<'EOF'
{
  "name": "Step2Verify",
  "version": "v0.2.0",
  "entrypoint": "game.rb",
  "export_directory": "./exports",
  "export_targets": ["android"],
  "load_paths": ["./"],
  "copy_paths": ["./assets"]
}
EOF

echo "==> game_activity_check"
rake android:release:game_activity_check

echo "==> android:release:build (compile + strip + gradle + sign)"
# Single Rake process so task ordering and config stay consistent
rake android:release:build
ls -la dist/android/release/libmain.so

echo "==> outputs"
ls -la "$GAME_ROOT/exports/android/"
ls -la "$GAME_ROOT/raylib.keystore"

APK=$(ls "$GAME_ROOT/exports/android/"*.apk | head -1)
echo "APK=$APK"

echo "==> apksigner verify"
apksigner verify --verbose "$APK"

echo "==> badging"
AAPT=/sdk/build-tools/34.0.0/aapt
BADGING=$("$AAPT" dump badging "$APK")
# Avoid pipefail+head SIGPIPE (exit 141)
printf '%s\n' "$BADGING" | sed -n '1,40p'

echo "==> assertions"
printf '%s\n' "$BADGING" | grep -q "application-label:'Step2Verify'"
printf '%s\n' "$BADGING" | grep -q "versionName='v0.2.0'"
printf '%s\n' "$BADGING" | grep -q "package: name='com.raylib.game'"
test -f "$GAME_ROOT/raylib.keystore"
apksigner verify "$APK" >/dev/null

echo "STEP2_VERIFY_OK"
