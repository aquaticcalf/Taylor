package com.raylib.game;

import com.google.androidgamesdk.GameActivity;

public class GameLoader extends GameActivity {
  static {
    System.loadLibrary("main");
  }
}
