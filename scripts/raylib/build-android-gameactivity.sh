#!/usr/bin/env bash
# Build raylib for Android with GameActivity; write libraylib.a into the mounted Taylor tree.
set -euo pipefail
export LANG=C.UTF-8 LC_ALL=C.UTF-8
export DEBIAN_FRONTEND=noninteractive

TAYLOR_ROOT="${TAYLOR_ROOT:-/app/taylor}"
WORK="${WORK:-/tmp/raylib}"

echo "==> Cloning raylib 6.0"
rm -rf "$WORK"
git clone --branch 6.0 --depth 1 https://github.com/raysan5/raylib.git "$WORK"
cd "$WORK"

echo "==> Applying GameActivity migration"
cp "$TAYLOR_ROOT/scripts/raylib/apply-gameactivity.rb" "$WORK/apply-gameactivity.rb"
cp -r "$TAYLOR_ROOT/scripts/raylib/gameactivity" "$WORK/gameactivity"
ruby "$WORK/apply-gameactivity.rb"

echo "==> Building PLATFORM_ANDROID"
cd "$WORK/src"
export ANDROID_NDK=/ndk/android-ndk-r25b
export ANDROID_NDK_HOME=/ndk/android-ndk-r25b
export PATH="/ndk/android-ndk-r25b/toolchains/llvm/prebuilt/linux-x86_64/bin:${PATH}"
export GAME_ACTIVITY_INCLUDE="$TAYLOR_ROOT/vendor/android/game-activity/include"
export CUSTOM_CFLAGS="-DSUPPORT_FILEFORMAT_BMP=1 -DSUPPORT_FILEFORMAT_JPG=1 -DSUPPORT_FILEFORMAT_HDR=1"

make clean || true
make PLATFORM=PLATFORM_ANDROID \
  ANDROID_NDK="$ANDROID_NDK" \
  GAME_ACTIVITY_INCLUDE="$GAME_ACTIVITY_INCLUDE" \
  -j"$(nproc)"

echo "==> Installing into vendor"
mkdir -p "$TAYLOR_ROOT/vendor/android/raylib/lib"
cp -f "$WORK/src/libraylib.a" "$TAYLOR_ROOT/vendor/android/raylib/lib/libraylib.a"
echo "gameactivity-4.4.2 raylib-6.0 $(date -u +%Y-%m-%dT%H:%MZ)" \
  > "$TAYLOR_ROOT/vendor/android/raylib/GAMEACTIVITY_BUILD"
ls -la "$TAYLOR_ROOT/vendor/android/raylib/lib/libraylib.a"
echo "RAYLIB_ANDROID_GAMEACTIVITY_OK"
