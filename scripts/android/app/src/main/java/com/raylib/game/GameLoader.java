package com.raylib.game;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.view.Display;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;

import com.google.androidgamesdk.GameActivity;

public class GameLoader extends GameActivity implements SensorEventListener {
  private static GameLoader sInstance;

  private static final float[] sAccel = new float[3];
  private static final float[] sGyro = new float[3];
  private static final float[] sMag = new float[3];
  private static volatile boolean sHasAccel;
  private static volatile boolean sHasGyro;
  private static volatile boolean sHasMag;

  private static final int[] sSafeArea = new int[4];

  private SensorManager sensorManager;
  private Sensor accelSensor;
  private Sensor gyroSensor;
  private Sensor magSensor;

  static {
    System.loadLibrary("main");
  }

  private static native void nativeOnOrientationChange(int orientation);

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    sInstance = this;

    final View root = findViewById(android.R.id.content);
    if (root != null) {
      root.setOnApplyWindowInsetsListener(
          (View v, WindowInsets insets) -> {
            updateSafeArea(insets);
            return v.onApplyWindowInsets(insets);
          });
    }

    sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
    if (sensorManager != null) {
      accelSensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
      gyroSensor = sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE);
      magSensor = sensorManager.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD);
      sHasAccel = accelSensor != null;
      sHasGyro = gyroSensor != null;
      sHasMag = magSensor != null;
    }
  }

  @Override
  protected void onResume() {
    super.onResume();
    if (sensorManager == null) {
      return;
    }
    final int rate = SensorManager.SENSOR_DELAY_GAME;
    if (accelSensor != null) {
      sensorManager.registerListener(this, accelSensor, rate);
    }
    if (gyroSensor != null) {
      sensorManager.registerListener(this, gyroSensor, rate);
    }
    if (magSensor != null) {
      sensorManager.registerListener(this, magSensor, rate);
    }
  }

  @Override
  protected void onPause() {
    if (sensorManager != null) {
      sensorManager.unregisterListener(this);
    }
    super.onPause();
  }

  @Override
  protected void onDestroy() {
    if (sensorManager != null) {
      sensorManager.unregisterListener(this);
    }
    if (sInstance == this) {
      sInstance = null;
    }
    super.onDestroy();
  }

  private static void updateSafeArea(WindowInsets insets) {
    synchronized (sSafeArea) {
      sSafeArea[0] = insets.getSystemWindowInsetTop();
      sSafeArea[1] = insets.getSystemWindowInsetRight();
      sSafeArea[2] = insets.getSystemWindowInsetBottom();
      sSafeArea[3] = insets.getSystemWindowInsetLeft();
    }
  }

  @Override
  public void onWindowFocusChanged(boolean hasFocus) {
    super.onWindowFocusChanged(hasFocus);
    if (hasFocus) {
      final View decorView = getWindow().getDecorView();
      if (decorView != null) {
        final WindowInsets insets = decorView.getRootWindowInsets();
        if (insets != null) {
          updateSafeArea(insets);
        }
      }
    }
  }

  @Override
  public void onSensorChanged(SensorEvent event) {
    final float[] target;
    switch (event.sensor.getType()) {
      case Sensor.TYPE_ACCELEROMETER:
        target = sAccel;
        break;
      case Sensor.TYPE_GYROSCOPE:
        target = sGyro;
        break;
      case Sensor.TYPE_MAGNETIC_FIELD:
        target = sMag;
        break;
      default:
        return;
    }
    synchronized (target) {
      System.arraycopy(event.values, 0, target, 0, Math.min(3, event.values.length));
    }
  }

  @Override
  public void onAccuracyChanged(Sensor sensor, int accuracy) {
    // no-op
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
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

  public static void setClipboardText(String text) {
    final GameLoader activity = sInstance;
    if (activity == null) {
      return;
    }
    ClipboardManager cm = (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
    if (cm != null) {
      cm.setPrimaryClip(ClipData.newPlainText("Taylor", text));
    }
  }

  public static String getClipboardText() {
    final GameLoader activity = sInstance;
    if (activity == null) {
      return "";
    }
    ClipboardManager cm = (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
    if (cm != null && cm.hasPrimaryClip()) {
      ClipData.Item item = cm.getPrimaryClip().getItemAt(0);
      CharSequence text = item.getText();
      return text != null ? text.toString() : "";
    }
    return "";
  }

  public static void setWindowTitle(String title) {
    final GameLoader activity = sInstance;
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(() -> activity.setTitle(title));
  }

  public static int getRefreshRate(int monitorId) {
    final GameLoader activity = sInstance;
    if (activity == null) {
      return 60;
    }
    WindowManager wm = activity.getWindowManager();
    if (wm == null) {
      return 60;
    }
    Display display = wm.getDefaultDisplay();
    return (int) display.getRefreshRate();
  }

  public static String getMonitorName(int monitorId) {
    final GameLoader activity = sInstance;
    if (activity == null) {
      return "";
    }
    WindowManager wm = activity.getWindowManager();
    if (wm == null) {
      return "";
    }
    Display display = wm.getDefaultDisplay();
    String name = display.getName();
    return name != null ? name : "";
  }

  public static void toggleFullscreen() {
    final GameLoader activity = sInstance;
    if (activity == null) {
      return;
    }
    activity.runOnUiThread(() -> {
      View decorView = activity.getWindow().getDecorView();
      int uiOptions = decorView.getSystemUiVisibility();
      if ((uiOptions & View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY) != 0) {
        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
      } else {
        decorView.setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            | View.SYSTEM_UI_FLAG_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION);
      }
    });
  }

  public static float[] getAccelerometer() {
    synchronized (sAccel) {
      return new float[] {sAccel[0], sAccel[1], sAccel[2]};
    }
  }

  public static float[] getGyroscope() {
    synchronized (sGyro) {
      return new float[] {sGyro[0], sGyro[1], sGyro[2]};
    }
  }

  public static float[] getMagnetometer() {
    synchronized (sMag) {
      return new float[] {sMag[0], sMag[1], sMag[2]};
    }
  }

  public static boolean hasAccelerometer() {
    return sHasAccel;
  }

  public static boolean hasGyroscope() {
    return sHasGyro;
  }

  public static boolean hasMagnetometer() {
    return sHasMag;
  }

  public static int[] getSafeAreaInsets() {
    synchronized (sSafeArea) {
      return new int[] {sSafeArea[0], sSafeArea[1], sSafeArea[2], sSafeArea[3]};
    }
  }
}
