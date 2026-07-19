require_relative "builder"
require_relative "helpers"

class AndroidBuilder < Builder
  GAME_ACTIVITY_ROOT = "./vendor/android/game-activity"
  GAME_ACTIVITY_INCLUDE = "#{GAME_ACTIVITY_ROOT}/include"
  GAME_ACTIVITY_LIB = "#{GAME_ACTIVITY_ROOT}/lib/arm64-v8a/libgame-activity_static.a"

  def setup_platform
    @name = "libmain.so"
    @platform = "android"
    @cxx = "aarch64-linux-android29-clang++"
    @cxxflags = <<-EOS.chomp
      -Oz \
      -stdlib=libc++ \
      -fPIC \
      -ffunction-sections -funwind-tables -fstack-protector-strong \
      -no-canonical-prefixes \
      -static-libstdc++ \
      -DANDROID \
      -D__ANDROID_API__=29
    EOS
    # Must stay an Array -- Builder#setup_includes appends, and #includes calls .join
    @includes = ["-I#{GAME_ACTIVITY_INCLUDE}"]

    @static_links += [
      "-shared",
      "-l log",
      "-l android",
      "-l EGL",
      "-l GLESv2",
      "-l OpenSLES",
      "-l atomic",
      # Keep GameActivity JNI entry from being stripped (see AGDK migration guide)
      "-u Java_com_google_androidgamesdk_GameActivity_initializeNativeCode",
      "-Wl,-soname,libmain.so",
      "./vendor/android/libmruby.a",
      "./vendor/android/raylib/lib/libraylib.a",
      GAME_ACTIVITY_LIB
    ]
  end

  def name
    "libmain.so"
  end

  def apk_name(final: false)
    "#{@options.name}#{"-unsigned" unless final}.apk"
  end
end

builder = AndroidBuilder.new
Builder.register(builder)

namespace :android do
  multitask build_depends: builder.depends
  multitask build_objects: builder.objects
  task build: builder.build_dependencies
  desc "Build for android in debug mode"
  task build: "build:android:debug"

  namespace :release do
    task :strip do
      sh <<-CMD
        /ndk/android-ndk-r25b/toolchains/llvm/prebuilt/linux-x86_64/bin/llvm-strip \
          "./dist/#{builder.platform}/#{builder.variant}/#{builder.name}"
      CMD
    end

    task :game_activity_check do
      lib = AndroidBuilder::GAME_ACTIVITY_LIB
      unless File.exist?(lib)
        raise "Missing GameActivity static library at #{lib}. Vendor androidx.games:games-activity (see vendor/android/game-activity)."
      end
      puts "Using GameActivity: #{lib}"
    end
    task build: :game_activity_check

    multitask build_depends: builder.depends("release")
    multitask build_objects: builder.objects("release")
    task build: builder.build_dependencies
    task build: "build:android:release"

    task :build_apk do
      game_root = ENV.fetch("GAME_ROOT", "/app/game")
      export_dir = "#{game_root}/exports/android"
      app_name = builder.name
      gradle_project = "/app/taylor/scripts/android"
      apk_out_dir = "#{gradle_project}/app/build/outputs/apk/release"
      unsigned_apk = "#{apk_out_dir}/app-release-unsigned.apk"
      release_apk = "#{apk_out_dir}/app-release.apk"

      sh "mkdir -p #{export_dir}"
      sh "mkdir -p #{game_root}/assets"

      sh <<-CMD
        export GAME_ROOT=#{game_root}
        export TAYLOR_ANDROID_LIB=/app/taylor/dist/android/release/#{builder.name}
        export ANDROID_HOME=/sdk
        export ANDROID_SDK_ROOT=/sdk
        cd #{gradle_project}
        gradle \
          --no-daemon \
          -PapplicationName=#{app_name} \
          :app:assembleRelease
      CMD

      built = if File.exist?(release_apk)
        release_apk
      elsif File.exist?(unsigned_apk)
        unsigned_apk
      else
        Dir.glob("#{apk_out_dir}/*.apk").first
      end

      raise "Gradle did not produce an APK in #{apk_out_dir}" unless built && File.exist?(built)

      final_apk = "#{export_dir}/#{builder.apk_name(final: true)}"
      sh "cp #{built} #{final_apk}"

      keystore = "#{game_root}/raylib.keystore"
      if File.exist?(keystore)
        sh <<-CMD
          apksigner sign \
            --ks-key-alias app \
            --ks #{keystore} \
            --ks-pass pass:buttsbuttsbutts \
            --key-pass pass:buttsbuttsbutts \
            #{final_apk}
        CMD
      else
        puts "WARNING: no keystore at #{keystore}; APK left unsigned"
      end

      puts "Android APK: #{final_apk}"
    end

    desc "Build for android in release mode"
    task build: :build_apk
  end
end
