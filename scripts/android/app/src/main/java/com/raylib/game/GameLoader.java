package com.raylib.game;

import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.os.Bundle;

import com.google.androidgamesdk.GameActivity;

public class GameLoader extends GameActivity {
  private static GameLoader sInstance;

  static {
    System.loadLibrary("main");
  }

  private static native void nativeOnOrientationChange(int orientation);

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    sInstance = this;
  }

  @Override
  protected void onDestroy() {
    if (sInstance == this) {
      sInstance = null;
    }
    super.onDestroy();
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    // Map physical config to ActivityInfo portrait/landscape constants used by Ruby.
    final int physical =
        (newConfig.orientation == Configuration.ORIENTATION_PORTRAIT)
            ? ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
            : ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
    nativeOnOrientationChange(physical);
  }

  public static void setOrientation(int orientation) {
    final GameLoader activity = sInstance;
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(() -> activity.setRequestedOrientation(orientation));
  }

  public static int getOrientation() {
    final GameLoader activity = sInstance;
    if (activity == null) {
      return ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
    }
    return activity.getRequestedOrientation();
  }
}
