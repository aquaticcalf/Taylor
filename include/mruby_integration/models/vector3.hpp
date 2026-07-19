#pragma once

#include "mruby.h"
#include "raylib.h"

extern RClass* Vector3_class;

auto mrb_Vector3_value(mrb_state*, Vector3*) -> mrb_value;

void append_models_Vector3(mrb_state*);
