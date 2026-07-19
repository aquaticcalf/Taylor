#!/usr/bin/env bash
# Compile libmain with Window.orientation JNI and check symbols.
set -euo pipefail
export LANG=C.UTF-8 LC_ALL=C.UTF-8
export PATH="/ndk/android-ndk-r25b/toolchains/llvm/prebuilt/linux-x86_64/bin:${PATH}"
export RUBYOPT="-rpathname -rjson ${RUBYOPT:-}"

gem install --no-document rake 2>/dev/null || true
export PATH="$(ruby -e 'puts Gem.bindir'):${PATH}"

cd /app/taylor
rake setup_ephemeral_files
rake android:release:game_activity_check
rake android:release:build_depends android:release:build_objects
rake build:android:release

ls -la dist/android/release/libmain.so
echo "==> symbols"
SYMS=$(llvm-nm dist/android/release/libmain.so)
printf '%s\n' "$SYMS" | grep -E 'JNI_OnLoad|taylor_android_set_orientation|taylor_android_get_orientation' || true
printf '%s\n' "$SYMS" | grep -E 'JNI_OnLoad' >/dev/null
printf '%s\n' "$SYMS" | grep -E 'taylor_android_set_orientation' >/dev/null
printf '%s\n' "$SYMS" | grep -E 'taylor_android_get_orientation' >/dev/null

echo "STEP4_LINK_OK"
