#!/usr/bin/env bash
# Smoke-build libmain.so for Android (GameActivity) inside taylor/build-android.
set -euo pipefail
export LANG=C.UTF-8 LC_ALL=C.UTF-8
export PATH="/ndk/android-ndk-r25b/toolchains/llvm/prebuilt/linux-x86_64/bin:${PATH}"

gem install --no-document rake 2>/dev/null || true
# Ubuntu's Ruby image often lacks pathname/json auto-load for modern rake
export RUBYOPT="-rpathname -rjson ${RUBYOPT:-}"

mkdir -p /app/game/assets /app/game/exports/android
if [ ! -f /app/game/taylor-config.json ]; then
  cat > /app/game/taylor-config.json <<'EOF'
{
  "name": "step1_smoke",
  "version": "v0.0.1",
  "entrypoint": "game.rb",
  "export_directory": "./exports",
  "export_targets": ["android"],
  "load_paths": ["./"],
  "copy_paths": ["./assets"]
}
EOF
fi
if [ ! -f /app/game/game.rb ]; then
  printf '%s\n' 'puts :ok' > /app/game/game.rb
fi

cd /app/taylor
rake android:release:game_activity_check
rake setup_ephemeral_files
rake android:release:build_depends android:release:build_objects
rake build:android:release

ls -la /app/taylor/dist/android/release/libmain.so
echo "==> Interesting symbols:"
llvm-nm /app/taylor/dist/android/release/libmain.so 2>/dev/null \
  | grep -E 'GameActivity|ANativeActivity|android_main|initializeNativeCode' \
  | head -40 || true
echo "LIBMAIN_SMOKE_OK"
