package com.raylib.game;

import android.content.Context;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;

import com.google.androidgamesdk.GameActivity;

public class GameLoader extends GameActivity implements SensorEventListener {
  private static GameLoader sInstance;

  private static final float[] sAccel = new float[3];
  private static final float[] sGyro = new float[3];
  private static final float[] sMag = new float[3];
  private static volatile boolean sHasAccel;
  private static volatile boolean sHasGyro;
  private static volatile boolean sHasMag;

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
}
