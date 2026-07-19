package com.raylib.game;

import android.content.pm.ActivityInfo;
import android.os.Bundle;

import com.google.androidgamesdk.GameActivity;

public class GameLoader extends GameActivity {
  private static GameLoader sInstance;

  static {
    System.loadLibrary("main");
  }

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
