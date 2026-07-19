// ANDROID: Process GameActivity input buffers (replaces AInputEvent callback)
static void AndroidProcessGameActivityInput(struct android_app *app)
{
    struct android_input_buffer *inputBuffer = android_app_swap_input_buffers(app);
    if (inputBuffer == NULL) return;

    // Motion / touch / gamepad axes
    for (uint64_t e = 0; e < inputBuffer->motionEventsCount; e++)
    {
        const GameActivityMotionEvent *event = &inputBuffer->motionEvents[e];
        int source = event->source;

        if (FLAG_IS_SET(source, AINPUT_SOURCE_JOYSTICK) ||
            FLAG_IS_SET(source, AINPUT_SOURCE_GAMEPAD))
        {
            CORE.Input.Gamepad.ready[0] = true;

            if (event->pointerCount > 0)
            {
                const GameActivityPointerAxes *p = &event->pointers[0];
                CORE.Input.Gamepad.axisState[0][GAMEPAD_AXIS_LEFT_X] =
                    GameActivityPointerAxes_getAxisValue(p, AMOTION_EVENT_AXIS_X);
                CORE.Input.Gamepad.axisState[0][GAMEPAD_AXIS_LEFT_Y] =
                    GameActivityPointerAxes_getAxisValue(p, AMOTION_EVENT_AXIS_Y);
                CORE.Input.Gamepad.axisState[0][GAMEPAD_AXIS_RIGHT_X] =
                    GameActivityPointerAxes_getAxisValue(p, AMOTION_EVENT_AXIS_Z);
                CORE.Input.Gamepad.axisState[0][GAMEPAD_AXIS_RIGHT_Y] =
                    GameActivityPointerAxes_getAxisValue(p, AMOTION_EVENT_AXIS_RZ);
                CORE.Input.Gamepad.axisState[0][GAMEPAD_AXIS_LEFT_TRIGGER] =
                    GameActivityPointerAxes_getAxisValue(p, AMOTION_EVENT_AXIS_BRAKE)*2.0f - 1.0f;
                CORE.Input.Gamepad.axisState[0][GAMEPAD_AXIS_RIGHT_TRIGGER] =
                    GameActivityPointerAxes_getAxisValue(p, AMOTION_EVENT_AXIS_GAS)*2.0f - 1.0f;

                float dpadX = GameActivityPointerAxes_getAxisValue(p, AMOTION_EVENT_AXIS_HAT_X);
                float dpadY = GameActivityPointerAxes_getAxisValue(p, AMOTION_EVENT_AXIS_HAT_Y);

                CORE.Input.Gamepad.currentButtonState[0][GAMEPAD_BUTTON_LEFT_FACE_RIGHT] = (dpadX == 1.0f);
                CORE.Input.Gamepad.currentButtonState[0][GAMEPAD_BUTTON_LEFT_FACE_LEFT] = (dpadX == -1.0f);
                CORE.Input.Gamepad.currentButtonState[0][GAMEPAD_BUTTON_LEFT_FACE_DOWN] = (dpadY == 1.0f);
                CORE.Input.Gamepad.currentButtonState[0][GAMEPAD_BUTTON_LEFT_FACE_UP] = (dpadY == -1.0f);
            }
            continue;
        }

        // Touch / pointer events
        touchRaw.pointCount = (int)event->pointerCount;
        for (int i = 0; (i < touchRaw.pointCount) && (i < MAX_TOUCH_POINTS); i++)
        {
            touchRaw.pointId[i] = event->pointers[i].id;
            touchRaw.position[i] = (Vector2){
                GameActivityPointerAxes_getX(&event->pointers[i]),
                GameActivityPointerAxes_getY(&event->pointers[i])
            };

            float widthRatio = (float)(CORE.Window.screen.width + CORE.Window.renderOffset.x)/(float)CORE.Window.display.width;
            float heightRatio = (float)(CORE.Window.screen.height + CORE.Window.renderOffset.y)/(float)CORE.Window.display.height;
            touchRaw.position[i].x = touchRaw.position[i].x*widthRatio - (float)CORE.Window.renderOffset.x/2;
            touchRaw.position[i].y = touchRaw.position[i].y*heightRatio - (float)CORE.Window.renderOffset.y/2;
        }

        int32_t action = event->action;
        unsigned int flags = action & AMOTION_EVENT_ACTION_MASK;

#if SUPPORT_GESTURES_SYSTEM
        GestureEvent gestureEvent = { 0 };
        gestureEvent.pointCount = 0;

        if (flags == AMOTION_EVENT_ACTION_DOWN) gestureEvent.touchAction = TOUCH_ACTION_DOWN;
        else if (flags == AMOTION_EVENT_ACTION_UP) gestureEvent.touchAction = TOUCH_ACTION_UP;
        else if (flags == AMOTION_EVENT_ACTION_MOVE) gestureEvent.touchAction = TOUCH_ACTION_MOVE;
        else if (flags == AMOTION_EVENT_ACTION_CANCEL) gestureEvent.touchAction = TOUCH_ACTION_CANCEL;

        for (int i = 0; (i < touchRaw.pointCount) && (i < MAX_TOUCH_POINTS); i++)
        {
            gestureEvent.pointId[gestureEvent.pointCount] = touchRaw.pointId[i];
            gestureEvent.position[gestureEvent.pointCount] = touchRaw.position[i];
            gestureEvent.position[gestureEvent.pointCount].x /= (float)GetScreenWidth();
            gestureEvent.position[gestureEvent.pointCount].y /= (float)GetScreenHeight();
            gestureEvent.pointCount++;
        }

        ProcessGestureEvent(gestureEvent);
#endif

        if ((flags == AMOTION_EVENT_ACTION_POINTER_UP) || (flags == AMOTION_EVENT_ACTION_UP))
        {
            int32_t pointerIndex = (action & AMOTION_EVENT_ACTION_POINTER_INDEX_MASK) >> AMOTION_EVENT_ACTION_POINTER_INDEX_SHIFT;
            for (int i = pointerIndex; (i < touchRaw.pointCount - 1) && (i < MAX_TOUCH_POINTS - 1); i++)
            {
                touchRaw.pointId[i] = touchRaw.pointId[i+1];
                touchRaw.position[i] = touchRaw.position[i+1];
            }
            if (touchRaw.pointCount > 0) touchRaw.pointCount--;
        }

        CORE.Input.Touch.pointCount = 0;
        for (int i = 0; (i < touchRaw.pointCount) && (i < MAX_TOUCH_POINTS); i++)
        {
            CORE.Input.Touch.pointId[CORE.Input.Touch.pointCount] = touchRaw.pointId[i];
            CORE.Input.Touch.position[CORE.Input.Touch.pointCount] = touchRaw.position[i];
            CORE.Input.Touch.pointCount++;
        }

        if (flags == AMOTION_EVENT_ACTION_CANCEL) CORE.Input.Touch.pointCount = 0;

        if (CORE.Input.Touch.pointCount > 0) CORE.Input.Touch.currentTouchState[MOUSE_BUTTON_LEFT] = 1;
        else CORE.Input.Touch.currentTouchState[MOUSE_BUTTON_LEFT] = 0;

        if (flags == AMOTION_EVENT_ACTION_MOVE) CORE.Input.Mouse.previousPosition = CORE.Input.Mouse.currentPosition;
        else CORE.Input.Mouse.previousPosition = CORE.Input.Touch.position[0];

        CORE.Input.Mouse.currentPosition = CORE.Input.Touch.position[0];
        CORE.Input.Mouse.currentWheelMove = (Vector2){ 0.0f, 0.0f };
    }
    android_app_clear_motion_events(inputBuffer);

    // Key events
    for (uint64_t e = 0; e < inputBuffer->keyEventsCount; e++)
    {
        const GameActivityKeyEvent *event = &inputBuffer->keyEvents[e];
        int source = event->source;
        int32_t keycode = event->keyCode;

        if ((FLAG_IS_SET(source, AINPUT_SOURCE_JOYSTICK) ||
             FLAG_IS_SET(source, AINPUT_SOURCE_GAMEPAD)) &&
            !FLAG_IS_SET(source, AINPUT_SOURCE_KEYBOARD))
        {
            CORE.Input.Gamepad.ready[0] = true;
            GamepadButton button = AndroidTranslateGamepadButton(keycode);
            if (button == GAMEPAD_BUTTON_UNKNOWN) continue;

            if (event->action == AKEY_EVENT_ACTION_DOWN)
                CORE.Input.Gamepad.currentButtonState[0][button] = 1;
            else
                CORE.Input.Gamepad.currentButtonState[0][button] = 0;
            continue;
        }

        KeyboardKey key = ((keycode > 0) && (keycode < KEYCODE_MAP_SIZE))? mapKeycode[keycode] : KEY_NULL;
        if (key != KEY_NULL)
        {
            if (event->action == AKEY_EVENT_ACTION_DOWN)
            {
                CORE.Input.Keyboard.currentKeyState[key] = 1;
                CORE.Input.Keyboard.keyPressedQueue[CORE.Input.Keyboard.keyPressedQueueCount] = key;
                CORE.Input.Keyboard.keyPressedQueueCount++;
            }
            else if (event->action == AKEY_EVENT_ACTION_MULTIPLE)
                CORE.Input.Keyboard.keyRepeatInFrame[key] = 1;
            else
                CORE.Input.Keyboard.currentKeyState[key] = 0;
        }
    }
    android_app_clear_key_events(inputBuffer);
}
