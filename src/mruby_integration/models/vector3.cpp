#include "mruby.h"
#include "mruby/class.h"
#include "mruby/data.h"
#include "raylib.h"

#include "mruby_integration/helpers.hpp"
#include "mruby_integration/struct_types.hpp"

#include "ruby/models/vector3.hpp"

struct RClass* Vector3_class;

auto mrb_Vector3_value(mrb_state* mrb, Vector3* vector) -> mrb_value
{
  return mrb_obj_value(Data_Wrap_Struct(mrb, Vector3_class, &Vector3_type, vector));
}

auto mrb_Vector3_initialize(mrb_state* mrb, mrb_value self) -> mrb_value
{
  Vector3* vector;
  mrb_self_ptr(mrb, self, Vector3, vector);

  const mrb_int kw_num = 3;
  const mrb_int kw_required = 3;
  const mrb_sym kw_names[] = {
    mrb_intern_lit(mrb, "x"),
    mrb_intern_lit(mrb, "y"),
    mrb_intern_lit(mrb, "z"),
  };
  mrb_value kw_values[kw_num];
  mrb_kwargs kwargs = { kw_num, kw_required, kw_names, kw_values, nullptr };
  mrb_get_args(mrb, ":", &kwargs);

  if (!mrb_undef_p(kw_values[0])) {
    vector->x = mrb_as_float(mrb, kw_values[0]);
  }
  if (!mrb_undef_p(kw_values[1])) {
    vector->y = mrb_as_float(mrb, kw_values[1]);
  }
  if (!mrb_undef_p(kw_values[2])) {
    vector->z = mrb_as_float(mrb, kw_values[2]);
  }

  mrb_data_init(self, vector, &Vector3_type);
  return self;
}

mrb_attr_accessor(mrb, self, float, f, Vector3, x);
mrb_attr_accessor(mrb, self, float, f, Vector3, y);
mrb_attr_accessor(mrb, self, float, f, Vector3, z);

void append_models_Vector3(mrb_state* mrb)
{
  Vector3_class = mrb_define_class(mrb, "Vector3", mrb->object_class);
  MRB_SET_INSTANCE_TT(Vector3_class, MRB_TT_DATA);
  mrb_define_method(mrb, Vector3_class, "initialize", mrb_Vector3_initialize, MRB_ARGS_REQ(1));
  mrb_attr_accessor_defines(mrb, Vector3, x);
  mrb_attr_accessor_defines(mrb, Vector3, y);
  mrb_attr_accessor_defines(mrb, Vector3, z);

  load_ruby_models_vector3(mrb);
}
