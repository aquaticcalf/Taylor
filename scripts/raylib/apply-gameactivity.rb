#!/usr/bin/env ruby
# frozen_string_literal: true

# Migrates raylib's Android platform backend from NativeActivity to GameActivity.
# Run from the raylib source root (the directory that contains src/).

require "pathname"

# raylib sources contain non-ASCII comments; Docker images often default to US-ASCII.
Encoding.default_external = Encoding::UTF_8
Encoding.default_internal = Encoding::UTF_8

root = Pathname.pwd
rcore = root.join("src/platforms/rcore_android.c")
makefile = root.join("src/Makefile")
abort "missing #{rcore}" unless rcore.file?
abort "missing #{makefile}" unless makefile.file?

# Support running from the Taylor repo (docker copies this script next to tweaks)
inc_candidates = [
  Pathname.new(__dir__).join("gameactivity/AndroidProcessGameActivityInput.inc.c"),
  Pathname.new("/app/gameactivity/AndroidProcessGameActivityInput.inc.c"),
  root.join("gameactivity/AndroidProcessGameActivityInput.inc.c")
]
inc_path = inc_candidates.find(&:file?)
abort "missing AndroidProcessGameActivityInput.inc.c" unless inc_path

content = rcore.read.force_encoding(Encoding::UTF_8)

# Already migrated?
if content.include?("game-activity/native_app_glue/android_native_app_glue.h")
  puts "rcore_android.c already uses GameActivity headers"
else
  content.sub!(
    "#include <android_native_app_glue.h>    // Required for: android_app struct and activity management",
    <<~INC.chomp
      #include <game-activity/native_app_glue/android_native_app_glue.h>  // GameActivity native_app_glue
      #include <game-activity/GameActivity.h>
    INC
  ) || abort("failed to rewrite android_native_app_glue include")

  content.gsub!("ANativeActivity_finish(app->activity);", "GameActivity_finish(app->activity);")
  content.gsub!("activity->clazz", "activity->javaGameActivity")
  content.gsub!(
    "ANativeActivity_setWindowFlags(platform.app->activity, AWINDOW_FLAG_FULLSCREEN, 0);  //AWINDOW_FLAG_SCALED, AWINDOW_FLAG_DITHER",
    "GameActivity_setWindowFlags(platform.app->activity, GAMEACTIVITY_FLAG_FULLSCREEN, 0);  // fullscreen"
  )

  content.sub!(
    "static int32_t AndroidInputCallback(struct android_app *app, AInputEvent *event);   // Process Android inputs",
    "static void AndroidProcessGameActivityInput(struct android_app *app); // Process GameActivity input buffers"
  ) || abort("failed to rewrite AndroidInputCallback declaration")

  content.sub!(
    "platform.app->onInputEvent = AndroidInputCallback;",
    <<~RUBY.chomp
      // GameActivity delivers input via input buffers, not onInputEvent.
          android_app_set_key_event_filter(platform.app, NULL);
          android_app_set_motion_event_filter(platform.app, NULL);
          GameActivityPointerAxes_enableAxis(AMOTION_EVENT_AXIS_Z);
          GameActivityPointerAxes_enableAxis(AMOTION_EVENT_AXIS_RZ);
          GameActivityPointerAxes_enableAxis(AMOTION_EVENT_AXIS_BRAKE);
          GameActivityPointerAxes_enableAxis(AMOTION_EVENT_AXIS_GAS);
          GameActivityPointerAxes_enableAxis(AMOTION_EVENT_AXIS_HAT_X);
          GameActivityPointerAxes_enableAxis(AMOTION_EVENT_AXIS_HAT_Y);
    RUBY
  ) || abort("failed to rewrite onInputEvent assignment")

  # Inject buffered input processing at end of PollInputEvents
  poll_marker = <<~C
            if (platform.app->destroyRequested != 0)
            {
                CORE.Window.shouldClose = true;
            }
        }
    }
  C
  poll_replacement = <<~C
            if (platform.app->destroyRequested != 0)
            {
                CORE.Window.shouldClose = true;
            }
        }

        // Process GameActivity buffered input (replaces NativeActivity onInputEvent)
        AndroidProcessGameActivityInput(platform.app);
    }
  C
  content.sub!(poll_marker, poll_replacement) || abort("failed to inject GameActivity input processing into PollInputEvents")

  # Replace the entire AndroidInputCallback function with GameActivity buffer processor
  unless content.sub!(
    %r{// ANDROID: Get input events\nstatic int32_t AndroidInputCallback\(struct android_app \*app, AInputEvent \*event\)\n\{.*?\n\}\n}m,
    inc_path.read.force_encoding(Encoding::UTF_8).sub(/\A/, "").sub(/\n?\z/, "\n")
  )
    abort "failed to replace AndroidInputCallback implementation"
  end

  rcore.write(content)
  puts "Updated #{rcore}"
end

# Point the Android Makefile includes at GameActivity headers instead of NDK native_app_glue
mk = makefile.read.force_encoding(Encoding::UTF_8)
unless mk.include?("GAME_ACTIVITY_INCLUDE")
  old = <<~'MAKE'
    ifeq ($(TARGET_PLATFORM),PLATFORM_ANDROID)
        NATIVE_APP_GLUE = $(ANDROID_NDK)/sources/android/native_app_glue
        # Include android_native_app_glue.h
        INCLUDE_PATHS += -I$(NATIVE_APP_GLUE)
  MAKE
  new = <<~'MAKE'
    ifeq ($(TARGET_PLATFORM),PLATFORM_ANDROID)
        # GameActivity (AGDK) native_app_glue + headers (vendored by Taylor)
        GAME_ACTIVITY_INCLUDE ?= /app/taylor/vendor/android/game-activity/include
        INCLUDE_PATHS += -I$(GAME_ACTIVITY_INCLUDE)
  MAKE
  mk.sub!(old, new) || abort("failed to rewrite Makefile Android include paths")

  # Drop NativeActivity-only forced symbol when building shared raylib (static builds ignore it)
  mk.gsub!(
    "    LDFLAGS += -u ANativeActivity_onCreate\n",
    "    # GameActivity: entry symbol resolved from libgame-activity_static.a at final link\n" \
    "    LDFLAGS += -u Java_com_google_androidgamesdk_GameActivity_initializeNativeCode\n"
  )

  # Do not compile NDK native_app_glue into raylib — GameActivity static lib is linked by Taylor
  mk.gsub!(
    "ifeq ($(TARGET_PLATFORM),PLATFORM_ANDROID)\n    OBJS += android_native_app_glue.o\nendif\n",
    "ifeq ($(TARGET_PLATFORM),PLATFORM_ANDROID)\n    # android_native_app_glue lives in GameActivity (linked by consumer)\nendif\n"
  )

  # Neutralize the standalone glue object rule (path no longer exists)
  mk.gsub!(
    "# Compile android_native_app_glue module\n" \
    "android_native_app_glue.o : $(NATIVE_APP_GLUE)/android_native_app_glue.c\n" \
    "\t$(CC) -c $< $(CFLAGS) $(INCLUDE_PATHS)\n",
    "# GameActivity: native_app_glue is not compiled as part of raylib\n"
  )

  mk.gsub!(
    "ifeq ($(TARGET_PLATFORM),PLATFORM_ANDROID)\n\trm -fv $(NATIVE_APP_GLUE)/android_native_app_glue.o\nendif\n",
    "ifeq ($(TARGET_PLATFORM),PLATFORM_ANDROID)\n\t# no NDK native_app_glue object to clean\nendif\n"
  )

  makefile.write(mk)
  puts "Updated #{makefile}"
else
  puts "Makefile already uses GAME_ACTIVITY_INCLUDE"
end

puts "GameActivity migration applied."
