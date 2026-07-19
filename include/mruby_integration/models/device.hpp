#pragma once

#include "mruby.h"

void append_models_Device(mrb_state*);

// Drain shake/rotation callbacks on the game thread (called from Window.begin_drawing).
void taylor_device_drain_callbacks(mrb_state* mrb);
