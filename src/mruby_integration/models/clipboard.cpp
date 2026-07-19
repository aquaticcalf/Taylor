#include "mruby.h"
#include "mruby/class.h"
#include "raylib.h"

#include "mruby_integration/android/jni.hpp"

struct RClass* Clipboard_class;

auto mrb_Clipboard_set_text(mrb_state* mrb, mrb_value) -> mrb_value
{
  const char* text;
  mrb_get_args(mrb, "z", &text);

#if defined(__ANDROID__) || defined(__NDK_MAJOR__)
  taylor_android_set_clipboard_text(text);
#else
  SetClipboardText(text);
#endif

  return mrb_nil_value();
}

auto mrb_Clipboard_text(mrb_state* mrb, mrb_value) -> mrb_value
{
#if defined(__ANDROID__) || defined(__NDK_MAJOR__)
  const char* text = taylor_android_clipboard_text();
  mrb_value result = mrb_str_new_cstr(mrb, text ? text : "");
  free(const_cast<char*>(text));
  return result;
#else
  const char* name = GetClipboardText();
  return mrb_str_new_cstr(mrb, name);
#endif
}

void append_models_Clipboard(mrb_state* mrb)
{
  Clipboard_class = mrb_define_module(mrb, "Clipboard");
  mrb_define_class_method(mrb, Clipboard_class, "text=", mrb_Clipboard_set_text, MRB_ARGS_REQ(1));
  mrb_define_class_method(mrb, Clipboard_class, "text", mrb_Clipboard_text, MRB_ARGS_NONE());
}
