export interface ApiParam {
  name: string
  type: string
  default?: string
  description: string
}

export interface ApiMethod {
  name: string
  description: string
  params: ApiParam[]
  returns: string
  raises: string[]
  example: string
  platform: string[]
  alias: string | null
  isAttribute?: boolean
}

export interface ApiConstant {
  name: string
  value: string
  description: string
}

export interface ApiInnerModule {
  name: string
  description: string
}

export interface ApiModule {
  name: string
  type: "class" | "module"
  description: string
  methods: ApiMethod[]
  constants: ApiConstant[]
  innerModules: ApiInnerModule[]
  innerClasses: ApiInnerModule[]
  filename: string
}

export const apiModules: ApiModule[] = [
  {
    "name": "Window",
    "type": "module",
    "description": "The Window module manages your game window — opening, closing, configuring flags and resolution, handling input state, and providing the main drawing loop.",
    "methods": [
      {
        "name": "open",
        "description": "Opens a new game window at the given resolution with the specified title.",
        "params": [
          { "name": "width: 800", "type": "any", "description": "The width of the window in pixels" },
          { "name": "height: 480", "type": "any", "description": "The height of the window in pixels" },
          { "name": "title: \"Taylor Game\"", "type": "any", "description": "The title displayed in the window's title bar" }
        ],
        "returns": "nil",
        "raises": ["Window::AlreadyOpenError"],
        "example": "Window.open(width: 1920, height: 1080, title: \"My super cool game!\")",
        "platform": [],
        "alias": null
      },
      {
        "name": "close",
        "description": "Closes the game window and cleans up resources.",
        "params": [],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.close",
        "platform": [],
        "alias": null
      },
      {
        "name": "ready?",
        "description": "Returns true if the window has been opened and is ready for drawing.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "if Window.ready?\n  puts \"Window is ready!\"\nend",
        "platform": [],
        "alias": null
      },
      {
        "name": "draw",
        "description": "Wrap all your drawing code inside this block. Everything you render goes between draw and end.",
        "params": [],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.draw do\n  # Drawing code here\nend",
        "platform": [],
        "alias": null
      },
      {
        "name": "begin_drawing",
        "description": "Starts the frame. You need to call this before any draw calls, and pair it with end_drawing.",
        "params": [],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.begin_drawing\n# Drawing code here\nWindow.end_drawing",
        "platform": [],
        "alias": null
      },
      {
        "name": "end_drawing",
        "description": "Finishes the frame and swaps the buffers to display what you drew.",
        "params": [],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.begin_drawing\n# Drawing code here\nWindow.end_drawing",
        "platform": [],
        "alias": null
      },
      {
        "name": "begin_blending",
        "description": "Starts a custom blend mode section. All draws inside will use the specified blend mode until end_blending is called.",
        "params": [
          { "name": "blend_mode", "type": "Integer", "description": "The blend mode to use: Window::Blend::ALPHA, ADDITIVE, MULTIPLIED, ADD_COLORS, SUBTRACT_COLORS, or ALPHA_PREMULTIPLY" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "Window.begin_blending(Window::Blend::ADDITIVE)\n# Drawing code here\nWindow.end_blending",
        "platform": [],
        "alias": null
      },
      {
        "name": "end_blending",
        "description": "Ends the custom blend mode section and returns to normal alpha blending.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "Window.begin_blending(Window::Blend::ADDITIVE)\n# Drawing code here\nWindow.end_blending",
        "platform": [],
        "alias": null
      },
      {
        "name": "blend",
        "description": "Runs a block of drawing code with a custom blend mode, then cleans up automatically.",
        "params": [
          { "name": "blend_mode", "type": "Integer", "description": "The blend mode to apply during the block" }
        ],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.blend(Window::Blend::ADDITIVE) do\n  # Blended drawing code here\nend",
        "platform": [],
        "alias": null
      },
      {
        "name": "width",
        "description": "Returns the current width of the window in pixels.",
        "params": [],
        "returns": "Integer",
        "raises": ["Window::NotReadyError"],
        "example": "puts Window.width",
        "platform": [],
        "alias": null
      },
      {
        "name": "height",
        "description": "Returns the current height of the window in pixels.",
        "params": [],
        "returns": "Integer",
        "raises": ["Window::NotReadyError"],
        "example": "puts Window.height",
        "platform": [],
        "alias": null
      },
      {
        "name": "title",
        "description": "Returns the current title of the window.",
        "params": [],
        "returns": "String",
        "raises": ["Window::NotReadyError"],
        "example": "puts Window.title",
        "platform": [],
        "alias": null
      },
      {
        "name": "title=",
        "description": "Changes the title displayed in the window's title bar.",
        "params": [
          { "name": "title", "type": "String", "description": "The new title for the window" }
        ],
        "returns": "String",
        "raises": ["Window::NotReadyError"],
        "example": "Window.title = \"A cool new title :)\"",
        "platform": [],
        "alias": null
      },
      {
        "name": "resolution",
        "description": "Returns the window's resolution as a Vector2 (width, height).",
        "params": [],
        "returns": "Vector2",
        "raises": ["Window::NotReadyError"],
        "example": "puts Window.resolution",
        "platform": [],
        "alias": null
      },
      {
        "name": "resolution=",
        "description": "Resizes the window to the given resolution.",
        "params": [
          { "name": "resolution", "type": "Vector2", "description": "The new width and height" }
        ],
        "returns": "Vector2",
        "raises": ["Window::NotReadyError"],
        "example": "Window.resolution = Vector2[1280, 720]",
        "platform": [],
        "alias": null
      },
      {
        "name": "close?",
        "description": "Checks if the user has asked the window to close since the last frame.",
        "params": [],
        "returns": "Boolean",
        "raises": ["Window::NotReadyError"],
        "example": "until Window.close?\n  Window.draw do\n    # Render stuff\n  end\nend",
        "platform": [],
        "alias": null
      },
      {
        "name": "flag?",
        "description": "Checks whether a specific window flag is currently set.",
        "params": [
          { "name": "flag", "type": "Integer", "description": "The flag to check, from Window::Flag" }
        ],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.flag?(Window::Flag::FULLSCREEN)",
        "platform": [],
        "alias": null
      },
      {
        "name": "flags=",
        "description": "Sets one or more window flags like fullscreen, resizable, or undecorated.",
        "params": [
          { "name": "flag", "type": "Integer", "description": "The flag or bitwise OR of multiple flags from Window::Flag" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "Window.flags = Window::Flag::RESIZABLE | Window::Flag::FULLSCREEN",
        "platform": [],
        "alias": null
      },
      {
        "name": "config=",
        "description": "Sets a configuration flag before the window is opened. Must be called before Window.open.",
        "params": [
          { "name": "flag", "type": "Integer", "description": "The configuration flag from Window::Flag" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "Window.config = Window::Flag::MSAA_4X_HINT\nWindow.open(width: 1920, height: 1080, title: \"Game\")",
        "platform": [],
        "alias": null
      },
      {
        "name": "clear_flag",
        "description": "Removes a previously set window flag.",
        "params": [
          { "name": "flag", "type": "Integer", "description": "The flag to clear" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "Window.clear_flag(Window::Flag::RESIZABLE)",
        "platform": [],
        "alias": null
      },
      {
        "name": "exit_key=",
        "description": "Sets which keyboard key triggers window close. Default is ESCAPE.",
        "params": [
          { "name": "key", "type": "Integer", "description": "The key code to listen for, from Key constants" }
        ],
        "returns": "Integer",
        "raises": ["Window::NotReadyError"],
        "example": "Window.exit_key = Key::Q",
        "platform": [],
        "alias": null
      },
      {
        "name": "resized?",
        "description": "Returns true if the window has been resized since the last frame.",
        "params": [],
        "returns": "Boolean",
        "raises": ["Window::NotReadyError"],
        "example": "if Window.resized?\n  # Recalculate UI layout\nend",
        "platform": [],
        "alias": null
      },
      {
        "name": "toggle_fullscreen",
        "description": "Toggles between fullscreen and windowed mode.",
        "params": [],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.toggle_fullscreen",
        "platform": [],
        "alias": null
      },
      {
        "name": "maximise",
        "description": "Maximises the window to fill the current monitor.",
        "params": [],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.maximise",
        "platform": [],
        "alias": null
      },
      {
        "name": "minimise",
        "description": "Minimises (iconifies) the window.",
        "params": [],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.minimise",
        "platform": [],
        "alias": null
      },
      {
        "name": "restore",
        "description": "Restores a minimised or maximised window back to normal size.",
        "params": [],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.restore",
        "platform": [],
        "alias": null
      },
      {
        "name": "icon=",
        "description": "Sets the window icon displayed in the title bar and taskbar.",
        "params": [
          { "name": "icon", "type": "Image", "description": "The image to use as the window icon" }
        ],
        "returns": "Image",
        "raises": ["Window::NotReadyError"],
        "example": "icon = Image.new(\"./assets/icon.png\")\nWindow.icon = icon",
        "platform": [],
        "alias": null
      },
      {
        "name": "position",
        "description": "Returns the window's position on the screen as a Vector2.",
        "params": [],
        "returns": "Vector2",
        "raises": ["Window::NotReadyError"],
        "example": "puts Window.position",
        "platform": [],
        "alias": null
      },
      {
        "name": "position=",
        "description": "Moves the window to a specific position on the screen.",
        "params": [
          { "name": "position", "type": "Vector2", "description": "The new x, y position for the window" }
        ],
        "returns": "Vector2",
        "raises": ["Window::NotReadyError"],
        "example": "Window.position = Vector2[100, 200]",
        "platform": [],
        "alias": null
      },
      {
        "name": "minimum_resolution",
        "description": "Returns the minimum allowed resolution for the window as a Vector2.",
        "params": [],
        "returns": "Vector2",
        "raises": ["Window::NotReadyError"],
        "example": "puts Window.minimum_resolution",
        "platform": [],
        "alias": null
      },
      {
        "name": "minimum_resolution=",
        "description": "Sets the minimum size the window can be resized to.",
        "params": [
          { "name": "resolution", "type": "Vector2", "description": "The minimum width and height" }
        ],
        "returns": "Vector2",
        "raises": ["Window::NotReadyError"],
        "example": "Window.minimum_resolution = Vector2[1280, 720]",
        "platform": [],
        "alias": null
      },
      {
        "name": "opacity",
        "description": "Returns the current window opacity as a float between 0.0 and 1.0.",
        "params": [],
        "returns": "Float",
        "raises": ["Window::NotReadyError"],
        "example": "puts Window.opacity",
        "platform": [],
        "alias": null
      },
      {
        "name": "opacity=",
        "description": "Sets the window opacity. 1.0 is fully opaque, 0.0 is fully transparent.",
        "params": [
          { "name": "opacity", "type": "Float", "description": "A value between 0.0 and 1.0" }
        ],
        "returns": "Float",
        "raises": ["ArgumentError"],
        "example": "Window.opacity = 0.75",
        "platform": [],
        "alias": null
      },
      {
        "name": "to_image",
        "description": "Takes a screenshot of the current window contents and returns it as an Image.",
        "params": [],
        "returns": "Image",
        "raises": ["Window::NotReadyError"],
        "example": "screenshot = Window.to_image",
        "platform": [],
        "alias": null
      },
      {
        "name": "monitor",
        "description": "Returns the Monitor object representing the display the window is currently on.",
        "params": [],
        "returns": "Monitor",
        "raises": ["Window::NotReadyError"],
        "example": "puts Window.monitor.id",
        "platform": [],
        "alias": null
      },
      {
        "name": "monitor=",
        "description": "Moves the window to a different monitor.",
        "params": [
          { "name": "monitor", "type": "Monitor", "description": "The target monitor to move the window to" }
        ],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.monitor = Monitor.all.last",
        "platform": [],
        "alias": null
      },
      {
        "name": "scale",
        "description": "Returns the window's DPI scale factor as a Vector2.",
        "params": [],
        "returns": "Vector2",
        "raises": ["Window::NotReadyError"],
        "example": "puts Window.scale",
        "platform": [],
        "alias": null
      },
      {
        "name": "clear",
        "description": "Clears the entire window to the specified colour, ready for the next frame.",
        "params": [
          { "name": "colour: Colour::BLACK", "type": "any", "description": "The colour to clear the screen to" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "Window.clear(colour: Colour::SKYBLUE)",
        "platform": [],
        "alias": null
      },
      {
        "name": "screenshot",
        "description": "Saves a screenshot of the current window to a file. The file extension determines the format.",
        "params": [
          { "name": "filename", "type": "String", "description": "The file path to save the screenshot to" }
        ],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.screenshot(\"./screenshots/game.png\")",
        "platform": [],
        "alias": null
      },
      {
        "name": "target_frame_rate=",
        "description": "Sets the target frame rate (e.g. 60, 120, or 144 FPS).",
        "params": [
          { "name": "frame_rate", "type": "Integer", "description": "The desired frames per second" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "Window.target_frame_rate = 60",
        "platform": [],
        "alias": null
      },
      {
        "name": "frame_rate",
        "description": "Returns the current actual frame rate of the game.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts Window.frame_rate",
        "platform": [],
        "alias": null
      },
      {
        "name": "frame_time",
        "description": "Returns the time in seconds the last frame took to render.",
        "params": [],
        "returns": "Float",
        "raises": [],
        "example": "puts Window.frame_time",
        "platform": [],
        "alias": null
      },
      {
        "name": "seconds_open",
        "description": "Returns the number of seconds since the window was opened.",
        "params": [],
        "returns": "Float",
        "raises": [],
        "example": "puts Window.seconds_open",
        "platform": [],
        "alias": null
      },
      {
        "name": "draw_frame_rate",
        "description": "Draws the current frame rate counter directly to the screen at the given position.",
        "params": [
          { "name": "x: 10", "type": "any", "description": "The x position to draw the FPS counter" },
          { "name": "y: 10", "type": "any", "description": "The y position to draw the FPS counter" }
        ],
        "returns": "nil",
        "raises": ["Window::NotReadyError"],
        "example": "Window.draw_frame_rate(x: 10, y: 10)",
        "platform": [],
        "alias": null
      },
      {
        "name": "vsync_hinted?",
        "description": "Returns true if V-Sync has been requested via the VSYNC_HINT flag.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.vsync_hinted?",
        "platform": [],
        "alias": null
      },
      {
        "name": "msaa_4x_hinted?",
        "description": "Returns true if MSAA 4x anti-aliasing has been configured.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.msaa_4x_hinted?",
        "platform": [],
        "alias": null
      },
      {
        "name": "interlaced_hinted?",
        "description": "Returns true if interlaced video format has been hinted.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.interlaced_hinted?",
        "platform": [],
        "alias": null
      },
      {
        "name": "fullscreen?",
        "description": "Returns true if the window is currently in fullscreen mode.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.fullscreen?",
        "platform": [],
        "alias": null
      },
      {
        "name": "resizable?",
        "description": "Returns true if the window has the resizable flag set.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.resizable?",
        "platform": [],
        "alias": null
      },
      {
        "name": "undecorated?",
        "description": "Returns true if the window has no title bar or borders.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.undecorated?",
        "platform": [],
        "alias": null
      },
      {
        "name": "hidden?",
        "description": "Returns true if the window is currently hidden.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.hidden?",
        "platform": [],
        "alias": null
      },
      {
        "name": "minimised?",
        "description": "Returns true if the window is currently minimised.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.minimised?",
        "platform": [],
        "alias": null
      },
      {
        "name": "maximised?",
        "description": "Returns true if the window is currently maximised.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.maximised?",
        "platform": [],
        "alias": null
      },
      {
        "name": "unfocused?",
        "description": "Returns true if the window does not have keyboard focus.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.unfocused?",
        "platform": [],
        "alias": null
      },
      {
        "name": "focused?",
        "description": "Returns true if the window currently has keyboard focus.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.focused?",
        "platform": [],
        "alias": null
      },
      {
        "name": "always_on_top?",
        "description": "Returns true if the window is set to stay on top of all other windows.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.always_on_top?",
        "platform": [],
        "alias": null
      },
      {
        "name": "always_run?",
        "description": "Returns true if the window is configured to keep running while minimised.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.always_run?",
        "platform": [],
        "alias": null
      },
      {
        "name": "transparent?",
        "description": "Returns true if the window was configured with a transparent framebuffer.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.transparent?",
        "platform": [],
        "alias": null
      },
      {
        "name": "high_dpi?",
        "description": "Returns true if the window was configured for high DPI rendering.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts Window.high_dpi?",
        "platform": [],
        "alias": null
      },
      {
        "name": "safe_area",
        "description": "Returns the safe area insets as an array of [top, right, bottom, left] in pixels. On Android this accounts for notches and status bars. On other platforms returns [0, 0, 0, 0].",
        "params": [],
        "returns": "Array<Integer>",
        "raises": [],
        "example": "top, right, bottom, left = Window.safe_area",
        "platform": ["android"],
        "alias": null
      },
      {
        "name": "aspect_ratio",
        "description": "Returns the window's aspect ratio (width divided by height).",
        "params": [],
        "returns": "Float",
        "raises": [],
        "example": "puts \"Aspect ratio: #{Window.aspect_ratio}\"",
        "platform": [],
        "alias": null
      },
      {
        "name": "logical_width",
        "description": "Returns the safe drawing width after subtracting left and right safe-area insets.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts Window.logical_width",
        "platform": [],
        "alias": null
      },
      {
        "name": "logical_height",
        "description": "Returns the safe drawing height after subtracting top and bottom safe-area insets.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts Window.logical_height",
        "platform": [],
        "alias": null
      },
      {
        "name": "letterbox",
        "description": "Returns a Rectangle representing the letterbox area — the safe drawing region that avoids notches and system bars.",
        "params": [],
        "returns": "Rectangle",
        "raises": [],
        "example": "letterbox = Window.letterbox",
        "platform": [],
        "alias": null
      },
      {
        "name": "orientation",
        "description": "Returns the screen orientation as a symbol (:landscape, :portrait, :auto, etc.). Primarily relevant on Android.",
        "params": [],
        "returns": "Symbol",
        "raises": [],
        "example": "puts Window.orientation",
        "platform": ["android"],
        "alias": null
      },
      {
        "name": "orientation=",
        "description": "Sets the preferred screen orientation. Options include :landscape, :portrait, :auto, :sensor, :sensor_landscape, :sensor_portrait, and :full_sensor.",
        "params": [
          { "name": "value", "type": "Symbol", "description": "The desired orientation" }
        ],
        "returns": "Symbol",
        "raises": ["ArgumentError"],
        "example": "Window.orientation = :landscape",
        "platform": ["android"],
        "alias": null
      },
      {
        "name": "on_orientation_change",
        "description": "Registers a block that fires when the screen orientation changes. The block receives the old and new orientation symbols.",
        "params": [],
        "returns": "Proc or nil",
        "raises": [],
        "example": "Window.on_orientation_change do |old, new|\n  puts \"Orientation changed from #{old} to #{new}\"\nend",
        "platform": ["android"],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [
      { "name": "Flag", "description": "Window flag constants for configuring window behaviour — fullscreen, resizable, undecorated, V-Sync, MSAA, high DPI, transparency, and more." },
      { "name": "Blend", "description": "Blend mode constants used with Window.blend and Window.begin_blending — ALPHA, ADDITIVE, MULTIPLIED, ADD_COLORS, SUBTRACT_COLORS, and ALPHA_PREMULTIPLY." }
    ],
    "innerClasses": [
      { "name": "NotReadyError", "description": "Raised when trying to use the Window system without first opening the window." },
      { "name": "AlreadyOpenError", "description": "Raised when trying to open the window when it's already open." }
    ],
    "filename": "src/ruby/models/window.rb"
  },
  {
    "name": "Audio",
    "type": "class",
    "description": "The Audio class manages the audio system. It provides error classes for sound-related operations.",
    "methods": [],
    "constants": [],
    "innerModules": [],
    "innerClasses": [
      { "name": "NotOpenError", "description": "Raised when trying to use audio functions without initialising the audio system first." }
    ],
    "filename": "src/ruby/models/audio.rb"
  },
  {
    "name": "Browser",
    "type": "module",
    "description": "The Browser module provides web browser integration � opening URLs, controlling the main loop, and reading HTML element attributes.",
    "methods": [
      {
        "name": "open",
        "description": "Opens a URL in the player's default web browser.",
        "params": [{ "name": "url", "type": "String", "description": "The URL to open" }],
        "returns": "nil",
        "raises": [],
        "example": "Browser.open(\"https://taylormadetech.dev\")",
        "platform": [],
        "alias": null
      },
      {
        "name": "main_loop=",
        "description": "Sets the main loop function name for web exports � tells the browser which JS function to call each frame.",
        "params": [{ "name": "method", "type": "String", "description": "The JS function name to call as the main loop" }],
        "returns": "nil",
        "raises": ["Taylor::Platform::MethodCalledOnInvalidPlatformError"],
        "example": "Browser.main_loop = \"main\"",
        "platform": ["web"],
        "alias": null
      },
      {
        "name": "cancel_main_loop",
        "description": "Cancels the web export main loop, stopping the game loop.",
        "params": [],
        "returns": "nil",
        "raises": ["Taylor::Platform::MethodCalledOnInvalidPlatformError"],
        "example": "Browser.cancel_main_loop",
        "platform": ["web"],
        "alias": null
      },
      {
        "name": "attribute_from_element",
        "description": "Reads an attribute from a DOM element matching the given CSS selector.",
        "params": [
          { "name": "selector", "type": "String", "description": "CSS selector to find the element" },
          { "name": "attribute", "type": "String", "description": "The attribute name to read" }
        ],
        "returns": "String",
        "raises": ["Taylor::Platform::MethodCalledOnInvalidPlatformError"],
        "example": "Browser.attribute_from_element(\".save-data\", \"data-save-json\")",
        "platform": ["web"],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "mrb_doc/models/browser.rb"
  },
  {
    "name": "Camera2D",
    "type": "class",
    "description": "The Camera2D class creates a movable viewport into your game world. Control the target (where the camera looks), offset (where on screen the target renders), rotation, and zoom.",
    "methods": [
      {
        "name": "initialize",
        "description": "Creates a new camera with the given target, offset, rotation, and zoom.",
        "params": [
          { "name": "target: (Vector2)", "type": "any", "description": "World position the camera focuses on" },
          { "name": "offset: (Vector2)", "type": "any", "description": "Screen position where the target point renders" },
          { "name": "rotation: (Float)", "type": "any", "description": "Camera rotation in degrees" },
          { "name": "zoom: (Float)", "type": "any", "description": "Camera zoom level (1.0 is normal)" }
        ],
        "returns": "Camera2D",
        "raises": [],
        "example": "camera = Camera2D.new(target: Vector2[400, 300], zoom: 2.0)",
        "platform": [],
        "alias": null
      },
      {
        "name": "offset",
        "description": "Where on the screen the camera's target point is rendered. Default is Vector2[0, 0] (top-left). Set to half screen dimensions to center the camera.",
        "params": [],
        "returns": "Vector2",
        "raises": [],
        "example": "camera.offset = Vector2[640, 360]",
        "platform": [],
        "alias": null,
        "isAttribute": true
      },
      {
        "name": "offset=",
        "description": "Sets where on the screen the camera's target point renders.",
        "params": [{ "name": "other", "type": "Vector2", "description": "The new offset position" }],
        "returns": "Vector2",
        "raises": [],
        "example": "camera.offset = Vector2[screen_width / 2, screen_height / 2]",
        "platform": [],
        "alias": null
      },
      {
        "name": "target",
        "description": "The world coordinate the camera is focused on. The camera follows this point.",
        "params": [],
        "returns": "Vector2",
        "raises": [],
        "example": "camera.target = Vector2[player.x, player.y]",
        "platform": [],
        "alias": null,
        "isAttribute": true
      },
      {
        "name": "target=",
        "description": "Sets the world coordinate the camera looks at. Usually set to the player's position each frame.",
        "params": [{ "name": "other", "type": "Vector2", "description": "The new target position" }],
        "returns": "Vector2",
        "raises": [],
        "example": "camera.target = Vector2[player.x, player.y]",
        "platform": [],
        "alias": null
      },
      {
        "name": "rotation",
        "description": "Returns the camera's rotation in degrees.",
        "params": [],
        "returns": "Float",
        "raises": [],
        "example": "puts camera.rotation",
        "platform": [],
        "alias": null,
        "isAttribute": true
      },
      {
        "name": "rotation=",
        "description": "Sets the camera's rotation in degrees. Rotates the view around the target.",
        "params": [{ "name": "degrees", "type": "Float", "description": "Rotation angle in degrees" }],
        "returns": "Float",
        "raises": [],
        "example": "camera.rotation = 45.0",
        "platform": [],
        "alias": null
      },
      {
        "name": "zoom",
        "description": "Returns the camera zoom level. 1.0 is normal, 2.0 is twice as zoomed in.",
        "params": [],
        "returns": "Float",
        "raises": [],
        "example": "puts camera.zoom",
        "platform": [],
        "alias": null,
        "isAttribute": true
      },
      {
        "name": "zoom=",
        "description": "Sets the camera zoom level. Values greater than 1.0 zoom in, less than 1.0 zoom out.",
        "params": [{ "name": "level", "type": "Float", "description": "The zoom multiplier" }],
        "returns": "Float",
        "raises": [],
        "example": "camera.zoom = 0.5",
        "platform": [],
        "alias": null
      },
      {
        "name": "to_h",
        "description": "Returns the camera's state as a Hash with :offset, :target, :rotation, and :zoom.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p camera.to_h",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/camera2d.rb"
  },
  {
    "name": "Circle",
    "type": "class",
    "description": "The Circle class draws circles to the screen with support for outlines, gradients, and hit-testing.",
    "methods": [
      {
        "name": "[]",
        "description": "Shorthand constructor � creates a new Circle in one line.",
        "params": [
          { "name": "x", "type": "Float", "description": "Center x" },
          { "name": "y", "type": "Float", "description": "Center y" },
          { "name": "radius", "type": "Float", "description": "Circle radius" },
          { "name": "colour: Colour::BLACK", "type": "any", "description": "Fill colour" }
        ],
        "returns": "Circle",
        "raises": [],
        "example": "circle = Circle[120, 200, 50, Colour::GREEN]",
        "platform": [],
        "alias": null
      },
      {
        "name": "to_h",
        "description": "Returns the circle's properties as a Hash.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p circle.to_h",
        "platform": [],
        "alias": null
      },
      {
        "name": "overlaps?",
        "description": "Checks if a Vector2 point is inside or on the border of this circle.",
        "params": [{ "name": "other", "type": "Vector2", "description": "The point to test" }],
        "returns": "Boolean",
        "raises": ["ArgumentError"],
        "example": "hitbox.overlaps?(Vector2.new(x: 15, y: 15))",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/circle.rb"
  },
  {
    "name": "Clipboard",
    "type": "module",
    "description": "The Clipboard module lets you read from and write to the system clipboard so players can copy and paste text.",
    "methods": [
      {
        "name": "text",
        "description": "Returns the current text from the system clipboard. In browsers this always returns an empty string.",
        "params": [],
        "returns": "String",
        "raises": [],
        "example": "puts Clipboard.text",
        "platform": [],
        "alias": null
      },
      {
        "name": "text=",
        "description": "Sets the text in the system clipboard so the player can paste it elsewhere.",
        "params": [{ "name": "text", "type": "String", "description": "The text to copy" }],
        "returns": "nil",
        "raises": [],
        "example": "Clipboard.text = \"Emma scored 30 points!\"",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "mrb_doc/models/clipboard.rb"
  },
  {
    "name": "Colour",
    "type": "class",
    "description": "The Colour class represents RGBA colours used for drawing primitives, textures, and text. Includes predefined colours and methods for fading, tinting, and adjusting brightness and contrast.",
    "methods": [
      {
        "name": "[]",
        "description": "Shorthand constructor � creates a new Colour from red, green, blue, and optional alpha.",
        "params": [
          { "name": "red: 0", "type": "any", "description": "Red value (0-255)" },
          { "name": "green: 0", "type": "any", "description": "Green value (0-255)" },
          { "name": "blue: 0", "type": "any", "description": "Blue value (0-255)" },
          { "name": "alpha: 255", "type": "any", "description": "Alpha value (0-255)" }
        ],
        "returns": "Colour",
        "raises": [],
        "example": "red = Colour[255, 0, 0]",
        "platform": [],
        "alias": null
      },
      {
        "name": "==",
        "description": "Compares two colours for equality based on their RGBA values.",
        "params": [{ "name": "other", "type": "Colour", "description": "The colour to compare" }],
        "returns": "Boolean",
        "raises": [],
        "example": "Colour[200, 200, 200] == Colour::LIGHTGRAY # => true",
        "platform": [],
        "alias": null
      },
      {
        "name": "to_h",
        "description": "Returns the colour as a Hash with :red, :green, :blue, and :alpha.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p Colour[64, 128, 196, 255].to_h",
        "platform": [],
        "alias": null
      },
      {
        "name": "fade",
        "description": "Returns a new colour with alpha adjusted to a percentage of its current value. Does not modify the original.",
        "params": [{ "name": "alpha", "type": "Float", "description": "Value between 0.0 and 1.0" }],
        "returns": "Colour",
        "raises": ["ArgumentError"],
        "example": "Colour[0, 255, 0, 196].fade(0.75)",
        "platform": [],
        "alias": null
      },
      {
        "name": "fade!",
        "description": "Adjusts the alpha channel to a percentage of its current value, modifying the colour in place.",
        "params": [{ "name": "alpha", "type": "Float", "description": "Value between 0.0 and 1.0" }],
        "returns": "Colour",
        "raises": ["ArgumentError"],
        "example": "colour.fade!(0.75)",
        "platform": [],
        "alias": null
      },
      {
        "name": "tint",
        "description": "Returns a new colour tinted by blending with another colour. Does not modify the original.",
        "params": [{ "name": "colour", "type": "Colour", "description": "The colour to tint with" }],
        "returns": "Colour",
        "raises": [],
        "example": "Colour[128, 128, 128, 255].tint(Colour::GREEN)",
        "platform": [],
        "alias": null
      },
      {
        "name": "tint!",
        "description": "Tints the colour by blending with another colour, modifying in place.",
        "params": [{ "name": "colour", "type": "Colour", "description": "The colour to tint with" }],
        "returns": "Colour",
        "raises": [],
        "example": "grey.tint!(Colour::GREEN)",
        "platform": [],
        "alias": null
      },
      {
        "name": "brightness",
        "description": "Returns a new colour brightened or darkened by a percentage. Does not modify the original.",
        "params": [{ "name": "percent", "type": "Float", "description": "Between -1.0 and 1.0" }],
        "returns": "Colour",
        "raises": ["ArgumentError"],
        "example": "Colour::RED.brightness(0.5)",
        "platform": [],
        "alias": null
      },
      {
        "name": "brightness!",
        "description": "Brightens or darkens the colour by a percentage, modifying in place.",
        "params": [{ "name": "percent", "type": "Float", "description": "Between -1.0 and 1.0" }],
        "returns": "Colour",
        "raises": ["ArgumentError"],
        "example": "red.brightness!(0.5)",
        "platform": [],
        "alias": null
      },
      {
        "name": "contrast",
        "description": "Returns a new colour with contrast adjusted by a percentage. Does not modify the original.",
        "params": [{ "name": "percent", "type": "Float", "description": "Between -1.0 and 1.0" }],
        "returns": "Colour",
        "raises": ["ArgumentError"],
        "example": "Colour::RED.contrast(0.5)",
        "platform": [],
        "alias": null
      },
      {
        "name": "contrast!",
        "description": "Adjusts the colour contrast by a percentage, modifying in place.",
        "params": [{ "name": "percent", "type": "Float", "description": "Between -1.0 and 1.0" }],
        "returns": "Colour",
        "raises": ["ArgumentError"],
        "example": "red.contrast!(0.5)",
        "platform": [],
        "alias": null
      },
      {
        "name": "inspect",
        "description": "Returns a debug-friendly string showing the colour's RGBA values.",
        "params": [],
        "returns": "String",
        "raises": [],
        "example": "puts Colour::PURPLE.inspect",
        "platform": [],
        "alias": null
      },
      {
        "name": "mock_return",
        "description": "Used internally for generating mock data during testing.",
        "params": [
          { "name": "red: 0", "type": "any", "description": "Red value" },
          { "name": "green: 0", "type": "any", "description": "Green value" },
          { "name": "blue: 0", "type": "any", "description": "Blue value" },
          { "name": "alpha: 255", "type": "any", "description": "Alpha value" }
        ],
        "returns": "String",
        "raises": [],
        "example": "",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [
      { "name": "LIGHTGRAY", "value": "Colour[200, 200, 200]", "description": "A light gray colour." },
      { "name": "GRAY", "value": "Colour[130, 130, 130]", "description": "A medium gray colour." },
      { "name": "DARKGRAY", "value": "Colour[80, 80, 80]", "description": "A dark gray colour." },
      { "name": "YELLOW", "value": "Colour[253, 249, 0]", "description": "A bright yellow colour." },
      { "name": "GOLD", "value": "Colour[255, 203, 0]", "description": "A gold colour." },
      { "name": "ORANGE", "value": "Colour[255, 161, 0]", "description": "A bright orange colour." },
      { "name": "PINK", "value": "Colour[255, 109, 194]", "description": "A pink colour." },
      { "name": "RED", "value": "Colour[230, 41, 55]", "description": "A vibrant red colour." },
      { "name": "MAROON", "value": "Colour[190, 33, 55]", "description": "A dark red colour." },
      { "name": "GREEN", "value": "Colour[0, 228, 48]", "description": "A vibrant green colour." },
      { "name": "LIME", "value": "Colour[0, 158, 47]", "description": "A lime green colour." },
      { "name": "DARKGREEN", "value": "Colour[0, 117, 44]", "description": "A dark green colour." },
      { "name": "SKYBLUE", "value": "Colour[102, 191, 255]", "description": "A sky blue colour." },
      { "name": "BLUE", "value": "Colour[0, 121, 241]", "description": "A vibrant blue colour." },
      { "name": "DARKBLUE", "value": "Colour[0, 82, 172]", "description": "A dark blue colour." },
      { "name": "PURPLE", "value": "Colour[200, 122, 255]", "description": "A purple colour." },
      { "name": "VIOLET", "value": "Colour[135, 60, 190]", "description": "A violet colour." },
      { "name": "DARKPURPLE", "value": "Colour[112, 31, 126]", "description": "A dark purple colour." },
      { "name": "BEIGE", "value": "Colour[211, 176, 131]", "description": "A beige colour." },
      { "name": "BROWN", "value": "Colour[127, 106, 79]", "description": "A brown colour." },
      { "name": "DARKBROWN", "value": "Colour[76, 63, 47]", "description": "A dark brown colour." },
      { "name": "WHITE", "value": "Colour[255, 255, 255]", "description": "A pure white colour." },
      { "name": "BLACK", "value": "Colour[0, 0, 0]", "description": "A pure black colour." },
      { "name": "BLANK", "value": "Colour[0, 0, 0, 0]", "description": "A fully transparent blank colour." },
      { "name": "MAGENTA", "value": "Colour[255, 0, 255]", "description": "A magenta colour." },
      { "name": "RAYWHITE", "value": "Colour[245, 245, 245]", "description": "The official Raylib white colour." }
    ],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/colour.rb"
  },
  {
    "name": "Cursor",
    "type": "class",
    "description": "The Cursor class provides constants for changing the mouse cursor to standard system pointers � arrows, I-beams, crosshairs, and resize handles.",
    "methods": [],
    "constants": [
      { "name": "DEFAULT", "value": "0", "description": "Default pointer icon." },
      { "name": "ARROW", "value": "1", "description": "Arrow pointer." },
      { "name": "IBEAM", "value": "2", "description": "Text selection I-beam cursor." },
      { "name": "CROSSHAIR", "value": "3", "description": "Crosshair cursor." },
      { "name": "POINTING_HAND", "value": "4", "description": "Hand pointer for clickable elements." },
      { "name": "RESIZE_EAST_WEST", "value": "5", "description": "Horizontal resize arrow." },
      { "name": "RESIZE_NORTH_SOUTH", "value": "6", "description": "Vertical resize arrow." },
      { "name": "RESIZE_NORTH_WEST_TO_SOUTH_EAST", "value": "7", "description": "Diagonal resize (top-left to bottom-right)." },
      { "name": "RESIZE_NORTH_EAST_TO_S_OUTH_WEST", "value": "8", "description": "Diagonal resize (top-right to bottom-left)." },
      { "name": "RESIZE_ALL", "value": "9", "description": "Omnidirectional move/resize cursor." },
      { "name": "NOT_ALLOWED", "value": "10", "description": "Operation not allowed cursor." }
    ],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/cursor.rb"
  },
  {
    "name": "Device",
    "type": "module",
    "description": "The Device module provides access to hardware sensors on mobile devices � accelerometer, gyroscope, and magnetometer. On desktop and web, sensor values return zero and availability checks return false.",
    "methods": [
      {
        "name": "accelerometer",
        "description": "Returns the current accelerometer reading in m/s� as a Vector3.",
        "params": [],
        "returns": "Vector3",
        "raises": [],
        "example": "a = Device.accelerometer",
        "platform": ["android"],
        "alias": null
      },
      {
        "name": "gyroscope",
        "description": "Returns the current gyroscope reading in rad/s as a Vector3.",
        "params": [],
        "returns": "Vector3",
        "raises": [],
        "example": "g = Device.gyroscope",
        "platform": ["android"],
        "alias": null
      },
      {
        "name": "magnetometer",
        "description": "Returns the current magnetometer reading in microtesla as a Vector3.",
        "params": [],
        "returns": "Vector3",
        "raises": [],
        "example": "m = Device.magnetometer",
        "platform": ["android"],
        "alias": null
      },
      {
        "name": "accelerometer?",
        "description": "Returns true if the device has an accelerometer sensor available.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "if Device.accelerometer? then puts \"yes!\" end",
        "platform": ["android"],
        "alias": null
      },
      {
        "name": "gyroscope?",
        "description": "Returns true if the device has a gyroscope sensor available.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "if Device.gyroscope? then puts \"yes!\" end",
        "platform": ["android"],
        "alias": null
      },
      {
        "name": "magnetometer?",
        "description": "Returns true if the device has a magnetometer sensor available.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "if Device.magnetometer? then puts \"yes!\" end",
        "platform": ["android"],
        "alias": null
      },
      {
        "name": "on_shake",
        "description": "Registers a callback that fires when the device detects a shake. The block receives the shake intensity.",
        "params": [],
        "returns": "Proc or nil",
        "raises": [],
        "example": "Device.on_shake { |intensity| puts \"Shake! #{intensity}\" }",
        "platform": ["android"],
        "alias": null
      },
      {
        "name": "on_rotation",
        "description": "Registers a callback for device orientation changes via sensors. Receives pitch, yaw, and roll in radians.",
        "params": [],
        "returns": "Proc or nil",
        "raises": [],
        "example": "Device.on_rotation { |pitch, yaw, roll| puts pitch, yaw, roll }",
        "platform": ["android"],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/device.rb"
  },
  {
    "name": "DroppedFiles",
    "type": "class",
    "description": "Handle files that players drag and drop onto your game window.",
    "methods": [
      {
        "name": "any?",
        "description": "Returns true if files have been dropped since the last check. Call all() afterwards to get them.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "if DroppedFiles.any? then deal_with(DroppedFiles.all) end",
        "platform": [],
        "alias": null
      },
      {
        "name": "all",
        "description": "Returns an array of file paths that were dropped since the last call. Calling this clears the list.",
        "params": [],
        "returns": "Array<String>",
        "raises": [],
        "example": "DroppedFiles.all.each { |f| puts f }",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "mrb_doc/models/dropped_files.rb"
  },
  {
    "name": "Font",
    "type": "class",
    "description": "The Font class loads TTF fonts and draws text to the screen with configurable size, colour, and position.",
    "methods": [
      {
        "name": "draw",
        "description": "Draws a string of text at the given position with the specified colour and size.",
        "params": [
          { "name": "text", "type": "String", "description": "The text to draw" },
          { "name": "size: self.size", "type": "any", "description": "Font size for this draw" },
          { "name": "spacing: 2", "type": "any", "description": "Character spacing" },
          { "name": "x: 0", "type": "any", "description": "X position" },
          { "name": "y: 0", "type": "any", "description": "Y position" },
          { "name": "position: Vector2[x, y]", "type": "any", "description": "Alternative to x/y" },
          { "name": "colour: Colour::BLACK", "type": "any", "description": "Text colour" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "font.draw(\"Hello\", x: 16, y: 12, colour: Colour::GREEN)",
        "platform": [],
        "alias": null
      },
      {
        "name": "draw_text",
        "description": "Draws text using the default font. Convenience method when you don't need a custom font.",
        "params": [
          { "name": "text", "type": "String", "description": "The text to draw" },
          { "name": "size: 32", "type": "any", "description": "Font size" },
          { "name": "spacing: 2", "type": "any", "description": "Character spacing" },
          { "name": "colour: BLACK", "type": "any", "description": "Text colour" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "Font.draw_text(\"Score: 100\", x: 10, y: 10)",
        "platform": [],
        "alias": null
      },
      {
        "name": "measure_text",
        "description": "Measures how wide a string of text will be in pixels at the given size and spacing.",
        "params": [
          { "name": "text", "type": "String", "description": "The text to measure" },
          { "name": "size: 32", "type": "any", "description": "Font size to measure at" },
          { "name": "spacing: 2", "type": "any", "description": "Character spacing" }
        ],
        "returns": "Integer",
        "raises": [],
        "example": "width = font.measure_text(\"Hello\", size: 16)",
        "platform": [],
        "alias": null
      },
      {
        "name": "to_h",
        "description": "Returns font properties as a Hash � size, glyph count, glyph padding, and texture info.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p font.to_h",
        "platform": [],
        "alias": null
      },
      {
        "name": "unload",
        "description": "Unloads the font from GPU memory. Call this when you're done with it.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "font.unload",
        "platform": [],
        "alias": null
      },
      {
        "name": "filter=",
        "description": "Sets texture filtering for the font's backing texture. NO_FILTER is best for pixel fonts, BILINEAR for smooth text.",
        "params": [
          { "name": "val", "type": "Integer", "description": "Texture filter constant (NO_FILTER, BILINEAR, TRILINEAR, ANISOTROPIC_4X, etc)" }
        ],
        "returns": "Integer",
        "raises": ["ArgumentError"],
        "example": "font.filter = Texture2D::BILINEAR",
        "platform": [],
        "alias": null
      },
      {
        "name": "mock_return",
        "description": "Used internally for generating mock data during testing.",
        "params": [
          { "name": "size: 0", "type": "any", "description": "Font size" },
          { "name": "glyph_count: 0", "type": "any", "description": "Glyph count" },
          { "name": "glyph_padding: 0", "type": "any", "description": "Glyph padding" }
        ],
        "returns": "String",
        "raises": [],
        "example": "",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [
      { "name": "NotFoundError", "description": "Raised when the font file is not found at the specified path." }
    ],
    "filename": "src/ruby/models/font.rb"
  },
  {
    "name": "Gamepad",
    "type": "class",
    "description": "The Gamepad class reads input from connected controllers � buttons, triggers, D-pad, joystick axes, and supports rumble.",
    "methods": [
      {
        "name": "[]",
        "description": "Returns the gamepad at the given index.",
        "params": [{ "name": "index", "type": "Integer", "description": "Gamepad index (0-based)" }],
        "returns": "Gamepad",
        "raises": ["ArgumentError"],
        "example": "p1 = Gamepad[0]",
        "platform": [],
        "alias": null
      },
      {
        "name": "all",
        "description": "Returns an array of all connected gamepads.",
        "params": [],
        "returns": "Array<Gamepad>",
        "raises": ["Gamepad::TooManyGamepadsError"],
        "example": "Gamepad.all.each { |g| puts g.name }",
        "platform": [],
        "alias": null
      },
      {
        "name": "count",
        "description": "Returns the number of connected gamepads.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts Gamepad.count",
        "platform": [],
        "alias": null
      },
      {
        "name": "axis_movement",
        "description": "Returns the current value of a joystick axis (range -1.0 to 1.0).",
        "params": [{ "name": "axis", "type": "Integer", "description": "Axis constant from Gamepad::Axis" }],
        "returns": "Float",
        "raises": [],
        "example": "x = gamepad.axis_movement(Gamepad::Axis::LEFT_X)",
        "platform": [],
        "alias": null
      },
      {
        "name": "button_down?",
        "description": "Returns true if a button is currently held down.",
        "params": [{ "name": "button", "type": "Integer", "description": "Button constant from Gamepad::Button, Trigger, or Dpad" }],
        "returns": "Boolean",
        "raises": [],
        "example": "if gamepad.button_down?(Gamepad::Button::DOWN) then player.jump() end",
        "platform": [],
        "alias": null
      },
      {
        "name": "button_pressed?",
        "description": "Returns true if a button was pressed this frame.",
        "params": [{ "name": "button", "type": "Integer", "description": "Button constant" }],
        "returns": "Boolean",
        "raises": [],
        "example": "if gamepad.button_pressed?(Gamepad::Button::UP) then puts \"jump\" end",
        "platform": [],
        "alias": null
      },
      {
        "name": "button_released?",
        "description": "Returns true if a button was released this frame.",
        "params": [{ "name": "button", "type": "Integer", "description": "Button constant" }],
        "returns": "Boolean",
        "raises": [],
        "example": "if gamepad.button_released?(Gamepad::Trigger::RIGHT_1) then puts \"reload\" end",
        "platform": [],
        "alias": null
      },
      {
        "name": "rumble",
        "description": "Triggers a vibration effect on the gamepad.",
        "params": [
          { "name": "duration", "type": "Float", "description": "Duration in seconds" },
          { "name": "frequency", "type": "Float", "description": "Vibration frequency" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "gamepad.rumble(0.5, 1.0)",
        "platform": [],
        "alias": null
      },
      {
        "name": "available?",
        "description": "Returns true if this gamepad index has a connected controller.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts gamepad.available?",
        "platform": [],
        "alias": null
      },
      {
        "name": "name",
        "description": "Returns the name of the controller (e.g. \"Xbox 360 Controller\").",
        "params": [],
        "returns": "String",
        "raises": [],
        "example": "puts gamepad.name",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [
      { "name": "Dpad", "description": "D-pad button constants � UP, RIGHT, DOWN, LEFT." },
      { "name": "Button", "description": "Face button constants � Nintendo/Xbox/PlayStation layouts. Includes SELECT, START, HOME, and joystick click buttons." },
      { "name": "Trigger", "description": "Shoulder button constants � LEFT_1, LEFT_2, RIGHT_1, RIGHT_2." },
      { "name": "Axis", "description": "Joystick axis constants � LEFT_X, LEFT_Y, RIGHT_X, RIGHT_Y, LEFT_TRIGGER, RIGHT_TRIGGER." }
    ],
    "innerClasses": [
      { "name": "TooManyGamepadsError", "description": "Raised when more than MAX_GAMEPADS controllers are connected." }
    ],
    "filename": "src/ruby/models/gamepad.rb"
  },
  {
    "name": "Gesture",
    "type": "class",
    "description": "The Gesture class detects touch gestures like taps, swipes, drags, pinches, and holds on touch-enabled devices.",
    "methods": [],
    "constants": [
      { "name": "NONE", "value": "0", "description": "No gesture detected." },
      { "name": "TAP", "value": "1", "description": "Single tap." },
      { "name": "DOUBLETAP", "value": "2", "description": "Double tap." },
      { "name": "HOLD", "value": "4", "description": "Long press hold." },
      { "name": "DRAG", "value": "8", "description": "Drag gesture." },
      { "name": "SWIPE_RIGHT", "value": "16", "description": "Swipe right." },
      { "name": "SWIPE_LEFT", "value": "32", "description": "Swipe left." },
      { "name": "SWIPE_UP", "value": "64", "description": "Swipe up." },
      { "name": "SWIPE_DOWN", "value": "128", "description": "Swipe down." },
      { "name": "PINCH_IN", "value": "256", "description": "Pinch to zoom in." },
      { "name": "PINCH_OUT", "value": "512", "description": "Pinch to zoom out." }
    ],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/gesture.rb"
  },
  {
    "name": "Image",
    "type": "class",
    "description": "The Image class loads image data from files or memory, providing pixel-level access for creating textures and manipulating graphics.",
    "methods": [
      {
        "name": "to_h",
        "description": "Returns the image's properties as a Hash � width, height, mipmaps, and format.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p image.to_h",
        "platform": [],
        "alias": null
      },
      {
        "name": "unload",
        "description": "Unloads the image from memory.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "image.unload",
        "platform": [],
        "alias": null
      },
      {
        "name": "valid?",
        "description": "Returns true if the image was loaded successfully.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "raise \"Bad image\" unless image.valid?",
        "platform": [],
        "alias": null
      },
      {
        "name": "generate_mipmaps",
        "description": "Generates mipmaps for the image for smoother rendering at smaller sizes.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "image.generate_mipmaps",
        "platform": [],
        "alias": null
      },
      {
        "name": "resize!",
        "description": "Resizes the image to the given dimensions.",
        "params": [
          { "name": "width", "type": "Integer", "description": "New width" },
          { "name": "height", "type": "Integer", "description": "New height" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "image.resize!(64, 64)",
        "platform": [],
        "alias": null
      },
      {
        "name": "resize_canvas!",
        "description": "Resizes the canvas without scaling the pixels � adds blank space or crops.",
        "params": [
          { "name": "width", "type": "Integer", "description": "New canvas width" },
          { "name": "height", "type": "Integer", "description": "New canvas height" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "image.resize_canvas!(128, 128)",
        "platform": [],
        "alias": null
      },
      {
        "name": "copy",
        "description": "Creates an independent copy of the image.",
        "params": [],
        "returns": "Image",
        "raises": [],
        "example": "copy = image.copy",
        "platform": [],
        "alias": null
      },
      {
        "name": "mask!",
        "description": "Applies a mask image � pixels where the mask is transparent become transparent.",
        "params": [{ "name": "mask", "type": "Image", "description": "The mask image" }],
        "returns": "nil",
        "raises": [],
        "example": "image.mask!(mask_image)",
        "platform": [],
        "alias": null
      },
      {
        "name": "alpha_mask!",
        "description": "Makes all pixels of the specified colour transparent.",
        "params": [{ "name": "colour", "type": "Colour", "description": "The colour to remove" }],
        "returns": "nil",
        "raises": [],
        "example": "image.alpha_mask!(Colour::GREEN)",
        "platform": [],
        "alias": null
      },
      {
        "name": "alpha_crop!",
        "description": "Crops the image to the bounding box of its non-transparent pixels.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "image.alpha_crop!",
        "platform": [],
        "alias": null
      },
      {
        "name": "to_texture",
        "description": "Uploads the image to the GPU and returns a Texture2D for drawing.",
        "params": [],
        "returns": "Texture2D",
        "raises": [],
        "example": "texture = image.to_texture",
        "platform": [],
        "alias": null
      },
      {
        "name": "get_colour",
        "description": "Returns the colour of the pixel at the given coordinates.",
        "params": [
          { "name": "x", "type": "Integer", "description": "X coordinate" },
          { "name": "y", "type": "Integer", "description": "Y coordinate" }
        ],
        "returns": "Colour",
        "raises": [],
        "example": "pixel = image.get_colour(10, 20)",
        "platform": [],
        "alias": null
      },
      {
        "name": "set_colour",
        "description": "Sets the colour of the pixel at the given coordinates.",
        "params": [
          { "name": "x", "type": "Integer", "description": "X coordinate" },
          { "name": "y", "type": "Integer", "description": "Y coordinate" },
          { "name": "colour", "type": "Colour", "description": "The colour to set" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "image.set_colour(10, 20, Colour::RED)",
        "platform": [],
        "alias": null
      },
      {
        "name": "contrast",
        "description": "Returns a new image with contrast adjusted. Does not modify the original.",
        "params": [{ "name": "contrast", "type": "Float", "description": "Between -1.0 and 1.0" }],
        "returns": "Image",
        "raises": [],
        "example": "img = image.contrast(0.5)",
        "platform": [],
        "alias": null
      },
      {
        "name": "brightness",
        "description": "Returns a new image with brightness adjusted. Does not modify the original.",
        "params": [{ "name": "brightness", "type": "Float", "description": "Between -1.0 and 1.0" }],
        "returns": "Image",
        "raises": [],
        "example": "img = image.brightness(0.3)",
        "platform": [],
        "alias": null
      },
      {
        "name": "replace_colour",
        "description": "Replaces all pixels of one colour with another.",
        "params": [
          { "name": "from", "type": "Colour", "description": "The colour to replace" },
          { "name": "to", "type": "Colour", "description": "The replacement colour" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "image.replace_colour(from: Colour::RED, to: Colour::BLUE)",
        "platform": [],
        "alias": null
      },
      {
        "name": "flip_vertical",
        "description": "Flips the image vertically.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "image.flip_vertical",
        "platform": [],
        "alias": null
      },
      {
        "name": "flip_horizontal",
        "description": "Flips the image horizontally.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "image.flip_horizontal",
        "platform": [],
        "alias": null
      },
      {
        "name": "rotate_cw",
        "description": "Rotates the image 90 degrees clockwise.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "image.rotate_cw",
        "platform": [],
        "alias": null
      },
      {
        "name": "rotate_ccw",
        "description": "Rotates the image 90 degrees counter-clockwise.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "image.rotate_ccw",
        "platform": [],
        "alias": null
      },
      {
        "name": "blur!",
        "description": "Applies a Gaussian blur to the image.",
        "params": [{ "name": "radius", "type": "Integer", "description": "Blur radius in pixels" }],
        "returns": "nil",
        "raises": [],
        "example": "image.blur!(4)",
        "platform": [],
        "alias": null
      },
      {
        "name": "mock_return",
        "description": "Used internally for generating mock data during testing.",
        "params": [
          { "name": "width: 10", "type": "any", "description": "Width" },
          { "name": "height: 10", "type": "any", "description": "Height" },
          { "name": "mipmaps: 1", "type": "any", "description": "Mipmaps" },
          { "name": "format: 0", "type": "any", "description": "Format" }
        ],
        "returns": "String",
        "raises": [],
        "example": "",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [
      { "name": "NotFoundError", "description": "Raised when the image file is not found." }
    ],
    "filename": "src/ruby/models/image.rb"
  },
  {
    "name": "Key",
    "type": "class",
    "description": "The Key module detects keyboard input � check if keys are pressed, held down, or released. Includes constants for every key.",
    "methods": [
      {
        "name": "down?",
        "description": "Returns true if the given key is currently held down.",
        "params": [{ "name": "key", "type": "Integer", "description": "The key constant to check" }],
        "returns": "Boolean",
        "raises": [],
        "example": "if Key.down?(Key::SPACE) then player.jump() end",
        "platform": [],
        "alias": null
      },
      {
        "name": "pressed?",
        "description": "Returns true if the given key was pressed this frame.",
        "params": [{ "name": "key", "type": "Integer", "description": "The key constant to check" }],
        "returns": "Boolean",
        "raises": [],
        "example": "if Key.pressed?(Key::ENTER) then puts \"go\" end",
        "platform": [],
        "alias": null
      },
      {
        "name": "released?",
        "description": "Returns true if the given key was released this frame.",
        "params": [{ "name": "key", "type": "Integer", "description": "The key constant to check" }],
        "returns": "Boolean",
        "raises": [],
        "example": "if Key.released?(Key::SHIFT) then puts \"shift released\" end",
        "platform": [],
        "alias": null
      },
      {
        "name": "pressed_keys",
        "description": "Returns an array of all keys pressed this frame.",
        "params": [],
        "returns": "Array<Integer>",
        "raises": [],
        "example": "Key.pressed_keys.each { |k| puts k }",
        "platform": [],
        "alias": null
      },
      {
        "name": "key_name",
        "description": "Returns the human-readable name for a key code like \"Space\" or \"Enter\".",
        "params": [{ "name": "key", "type": "any", "description": "The key code" }],
        "returns": "String",
        "raises": [],
        "example": "puts Key.key_name(Key::SPACE) # => \"Space\"",
        "platform": [],
        "alias": null
      },
      {
        "name": "key_code",
        "description": "Returns the numeric key code for a key name string.",
        "params": [{ "name": "key", "type": "any", "description": "The key name" }],
        "returns": "Integer",
        "raises": [],
        "example": "puts Key.key_code(\"A\") # => 65",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [
      { "name": "APOSTROPHE", "value": "39", "description": "' key." },
      { "name": "COMMA", "value": "44", "description": ", key." },
      { "name": "MINUS", "value": "45", "description": "- key." },
      { "name": "PERIOD", "value": "46", "description": ". key." },
      { "name": "SLASH", "value": "47", "description": "/ key." },
      { "name": "ZERO", "value": "48", "description": "0 key." },
      { "name": "ONE", "value": "49", "description": "1 key." },
      { "name": "TWO", "value": "50", "description": "2 key." },
      { "name": "THREE", "value": "51", "description": "3 key." },
      { "name": "FOUR", "value": "52", "description": "4 key." },
      { "name": "FIVE", "value": "53", "description": "5 key." },
      { "name": "SIX", "value": "54", "description": "6 key." },
      { "name": "SEVEN", "value": "55", "description": "7 key." },
      { "name": "EIGHT", "value": "56", "description": "8 key." },
      { "name": "NINE", "value": "57", "description": "9 key." },
      { "name": "SEMICOLON", "value": "59", "description": "; key." },
      { "name": "EQUAL", "value": "61", "description": "= key." },
      { "name": "A", "value": "65", "description": "A key." },
      { "name": "B", "value": "66", "description": "B key." },
      { "name": "C", "value": "67", "description": "C key." },
      { "name": "D", "value": "68", "description": "D key." },
      { "name": "E", "value": "69", "description": "E key." },
      { "name": "F", "value": "70", "description": "F key." },
      { "name": "G", "value": "71", "description": "G key." },
      { "name": "H", "value": "72", "description": "H key." },
      { "name": "I", "value": "73", "description": "I key." },
      { "name": "J", "value": "74", "description": "J key." },
      { "name": "K", "value": "75", "description": "K key." },
      { "name": "L", "value": "76", "description": "L key." },
      { "name": "M", "value": "77", "description": "M key." },
      { "name": "N", "value": "78", "description": "N key." },
      { "name": "O", "value": "79", "description": "O key." },
      { "name": "P", "value": "80", "description": "P key." },
      { "name": "Q", "value": "81", "description": "Q key." },
      { "name": "R", "value": "82", "description": "R key." },
      { "name": "S", "value": "83", "description": "S key." },
      { "name": "T", "value": "84", "description": "T key." },
      { "name": "U", "value": "85", "description": "U key." },
      { "name": "V", "value": "86", "description": "V key." },
      { "name": "W", "value": "87", "description": "W key." },
      { "name": "X", "value": "88", "description": "X key." },
      { "name": "Y", "value": "89", "description": "Y key." },
      { "name": "Z", "value": "90", "description": "Z key." },
      { "name": "SPACE", "value": "32", "description": "Space key." },
      { "name": "ESCAPE", "value": "256", "description": "Escape key." },
      { "name": "ENTER", "value": "257", "description": "Enter key." },
      { "name": "TAB", "value": "258", "description": "Tab key." },
      { "name": "BACKSPACE", "value": "259", "description": "Backspace key." },
      { "name": "INSERT", "value": "260", "description": "Insert key." },
      { "name": "DELETE", "value": "261", "description": "Delete key." },
      { "name": "RIGHT", "value": "262", "description": "Right arrow." },
      { "name": "LEFT", "value": "263", "description": "Left arrow." },
      { "name": "DOWN", "value": "264", "description": "Down arrow." },
      { "name": "UP", "value": "265", "description": "Up arrow." },
      { "name": "PAGE_UP", "value": "266", "description": "Page up." },
      { "name": "PAGE_DOWN", "value": "267", "description": "Page down." },
      { "name": "HOME", "value": "268", "description": "Home key." },
      { "name": "END", "value": "269", "description": "End key." },
      { "name": "CAPS_LOCK", "value": "280", "description": "Caps lock." },
      { "name": "SCROLL_LOCK", "value": "281", "description": "Scroll lock." },
      { "name": "NUM_LOCK", "value": "282", "description": "Num lock." },
      { "name": "PRINT_SCREEN", "value": "283", "description": "Print screen." },
      { "name": "PAUSE", "value": "284", "description": "Pause key." },
      { "name": "F1", "value": "290", "description": "F1 key." },
      { "name": "F2", "value": "291", "description": "F2 key." },
      { "name": "F3", "value": "292", "description": "F3 key." },
      { "name": "F4", "value": "293", "description": "F4 key." },
      { "name": "F5", "value": "294", "description": "F5 key." },
      { "name": "F6", "value": "295", "description": "F6 key." },
      { "name": "F7", "value": "296", "description": "F7 key." },
      { "name": "F8", "value": "297", "description": "F8 key." },
      { "name": "F9", "value": "298", "description": "F9 key." },
      { "name": "F10", "value": "299", "description": "F10 key." },
      { "name": "F11", "value": "300", "description": "F11 key." },
      { "name": "F12", "value": "301", "description": "F12 key." },
      { "name": "LEFT_SHIFT", "value": "340", "description": "Left shift." },
      { "name": "LEFT_CONTROL", "value": "341", "description": "Left control." },
      { "name": "LEFT_ALT", "value": "342", "description": "Left alt." },
      { "name": "LEFT_SUPER", "value": "343", "description": "Left super (Win/Cmd)." },
      { "name": "RIGHT_SHIFT", "value": "344", "description": "Right shift." },
      { "name": "RIGHT_CONTROL", "value": "345", "description": "Right control." },
      { "name": "RIGHT_ALT", "value": "346", "description": "Right alt." },
      { "name": "RIGHT_SUPER", "value": "347", "description": "Right super (Win/Cmd)." },
      { "name": "KB_MENU", "value": "348", "description": "Menu key." },
      { "name": "LEFT_BRACKET", "value": "91", "description": "[ key." },
      { "name": "BACKSLASH", "value": "92", "description": "\\ key." },
      { "name": "RIGHT_BRACKET", "value": "93", "description": "] key." },
      { "name": "GRAVE", "value": "96", "description": " key." },
      { "name": "KP_0", "value": "320", "description": "Keypad 0." },
      { "name": "KP_1", "value": "321", "description": "Keypad 1." },
      { "name": "KP_2", "value": "322", "description": "Keypad 2." },
      { "name": "KP_3", "value": "323", "description": "Keypad 3." },
      { "name": "KP_4", "value": "324", "description": "Keypad 4." },
      { "name": "KP_5", "value": "325", "description": "Keypad 5." },
      { "name": "KP_6", "value": "326", "description": "Keypad 6." },
      { "name": "KP_7", "value": "327", "description": "Keypad 7." },
      { "name": "KP_8", "value": "328", "description": "Keypad 8." },
      { "name": "KP_9", "value": "329", "description": "Keypad 9." },
      { "name": "KP_DECIMAL", "value": "330", "description": "Keypad ." },
      { "name": "KP_DIVIDE", "value": "331", "description": "Keypad /" },
      { "name": "KP_MULTIPLY", "value": "332", "description": "Keypad *" },
      { "name": "KP_SUBTRACT", "value": "333", "description": "Keypad -" },
      { "name": "KP_ADD", "value": "334", "description": "Keypad +" },
      { "name": "KP_ENTER", "value": "335", "description": "Keypad Enter" },
      { "name": "KP_EQUAL", "value": "336", "description": "Keypad =" },
      { "name": "BACK", "value": "4", "description": "Android back." },
      { "name": "MENU", "value": "5", "description": "Android menu." },
      { "name": "VOLUME_UP", "value": "24", "description": "Android volume up." },
      { "name": "VOLUME_DOWN", "value": "25", "description": "Android volume down." }
    ],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/key.rb"
  },
  {
    "name": "Line",
    "type": "class",
    "description": "The Line class draws straight lines between two points with configurable colour and thickness.",
    "methods": [
      {
        "name": "to_h",
        "description": "Returns the line's properties as a Hash � start, end, colour, and thickness.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p line.to_h",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/line.rb"
  },
  {
    "name": "LocalStorage",
    "type": "class",
    "description": "Persistent key-value storage in the browser via the localStorage API (web only).",
    "methods": [
      {
        "name": "get_item",
        "description": "Returns the value for a given key. Returns empty string if the key doesn't exist.",
        "params": [{ "name": "key", "type": "String", "description": "The storage key" }],
        "returns": "String",
        "raises": ["Taylor::Platform::MethodCalledOnInvalidPlatformError"],
        "example": "data = LocalStorage.get_item(\"save_data\")",
        "platform": ["web"],
        "alias": null
      },
      {
        "name": "set_item",
        "description": "Stores a value for a given key in the browser's localStorage.",
        "params": [
          { "name": "key", "type": "String", "description": "The storage key" },
          { "name": "value", "type": "String", "description": "The value to store" }
        ],
        "returns": "nil",
        "raises": ["Taylor::Platform::MethodCalledOnInvalidPlatformError"],
        "example": "LocalStorage.set_item(\"high_score\", \"99999\")",
        "platform": ["web"],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/local_storage.rb"
  },
  {
    "name": "Logging",
    "type": "module",
    "description": "Control log output levels from verbose trace up to errors and fatal, with the option to silence everything.",
    "methods": [
      {
        "name": "level",
        "description": "Returns the current log level threshold.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts Logging.level",
        "platform": [],
        "alias": null
      },
      {
        "name": "level=",
        "description": "Sets the log level. Messages below this threshold are suppressed.",
        "params": [{ "name": "level", "type": "Integer", "description": "One of Logging::ALL, TRACE, DEBUG, INFO, WARNING, ERROR, FATAL, or NONE" }],
        "returns": "Integer",
        "raises": [],
        "example": "Logging.level = Logging::WARNING",
        "platform": [],
        "alias": null
      },
      {
        "name": "send",
        "description": "Sends a log message at the specified severity level.",
        "params": [
          { "name": "message", "type": "any", "description": "The message to log" },
          { "name": "level: Logging::INFO", "type": "any", "description": "The severity level" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "Logging.send(\"Game started!\", level: Logging::INFO)",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [
      { "name": "ALL", "value": "0", "description": "Log everything." },
      { "name": "TRACE", "value": "1", "description": "Trace and above." },
      { "name": "DEBUG", "value": "2", "description": "Debug and above." },
      { "name": "INFO", "value": "3", "description": "Info and above." },
      { "name": "WARNING", "value": "4", "description": "Warnings and above." },
      { "name": "ERROR", "value": "5", "description": "Errors only." },
      { "name": "FATAL", "value": "6", "description": "Fatal only." },
      { "name": "NONE", "value": "7", "description": "Silence all logging." }
    ],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/logging.rb"
  },
  {
    "name": "Monitor",
    "type": "class",
    "description": "Information about the displays attached to your computer � resolution, count, and which one the game window is on.",
    "methods": [
      {
        "name": "[]",
        "description": "Returns the monitor at the given index.",
        "params": [{ "name": "id", "type": "Integer", "description": "Monitor index (0-based)" }],
        "returns": "Monitor",
        "raises": ["Window::NotReadyError", "ArgumentError"],
        "example": "primary = Monitor[0]",
        "platform": [],
        "alias": null
      },
      {
        "name": "all",
        "description": "Returns an array of all connected monitors.",
        "params": [],
        "returns": "Array<Monitor>",
        "raises": ["Window::NotReadyError"],
        "example": "Monitor.all.each { |m| puts m.resolution }",
        "platform": [],
        "alias": null
      },
      {
        "name": "current",
        "description": "Returns the monitor the game window is currently on.",
        "params": [],
        "returns": "Monitor",
        "raises": [],
        "example": "puts Monitor.current.id",
        "platform": [],
        "alias": null
      },
      {
        "name": "count",
        "description": "Returns the number of monitors connected to the computer.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts Monitor.count",
        "platform": [],
        "alias": null
      },
      {
        "name": "resolution",
        "description": "Returns this monitor's resolution as a Vector2.",
        "params": [],
        "returns": "Vector2",
        "raises": ["Window::NotReadyError"],
        "example": "puts Monitor.current.resolution",
        "platform": [],
        "alias": null
      },
      {
        "name": "width",
        "description": "Returns this monitor's width in pixels.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts Monitor.current.width",
        "platform": [],
        "alias": null
      },
      {
        "name": "height",
        "description": "Returns this monitor's height in pixels.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts Monitor.current.height",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/monitor.rb"
  },
  {
    "name": "Mouse",
    "type": "class",
    "description": "Handle mouse input � tracking position, detecting button clicks, and managing cursor visibility.",
    "methods": [
      {
        "name": "down?",
        "description": "Returns true if a mouse button is currently held down.",
        "params": [{ "name": "button", "type": "Integer", "description": "Mouse::LEFT, RIGHT, or MIDDLE" }],
        "returns": "Boolean",
        "raises": [],
        "example": "if Mouse.down?(Mouse::LEFT) then puts \"holding\" end",
        "platform": [],
        "alias": null
      },
      {
        "name": "pressed?",
        "description": "Returns true if a mouse button was pressed this frame.",
        "params": [{ "name": "button", "type": "Integer", "description": "Mouse::LEFT, RIGHT, or MIDDLE" }],
        "returns": "Boolean",
        "raises": [],
        "example": "if Mouse.pressed?(Mouse::LEFT) then puts \"click!\" end",
        "platform": [],
        "alias": null
      },
      {
        "name": "released?",
        "description": "Returns true if a mouse button was released this frame.",
        "params": [{ "name": "button", "type": "Integer", "description": "Mouse::LEFT, RIGHT, or MIDDLE" }],
        "returns": "Boolean",
        "raises": [],
        "example": "if Mouse.released?(Mouse::LEFT) then puts \"release!\" end",
        "platform": [],
        "alias": null
      },
      {
        "name": "x",
        "description": "Returns the mouse cursor's current x position.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts Mouse.x",
        "platform": [],
        "alias": null
      },
      {
        "name": "y",
        "description": "Returns the mouse cursor's current y position.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts Mouse.y",
        "platform": [],
        "alias": null
      },
      {
        "name": "position",
        "description": "Returns the mouse cursor's current position as a Vector2.",
        "params": [],
        "returns": "Vector2",
        "raises": [],
        "example": "puts Mouse.position",
        "platform": [],
        "alias": null
      },
      {
        "name": "delta",
        "description": "Returns the mouse movement since last frame as a Vector2. Useful for camera controls.",
        "params": [],
        "returns": "Vector2",
        "raises": [],
        "example": "look = Mouse.delta",
        "platform": [],
        "alias": null
      },
      {
        "name": "wheel",
        "description": "Returns the scroll wheel movement since last frame as a Vector2.",
        "params": [],
        "returns": "Vector2",
        "raises": [],
        "example": "scroll = Mouse.wheel",
        "platform": [],
        "alias": null
      },
      {
        "name": "hide",
        "description": "Hides the mouse cursor.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "Mouse.hide",
        "platform": [],
        "alias": null
      },
      {
        "name": "show",
        "description": "Shows the mouse cursor if it was hidden.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "Mouse.show",
        "platform": [],
        "alias": null
      },
      {
        "name": "locked?",
        "description": "Returns true if the mouse cursor is locked to the window.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "unless Mouse.locked? then Mouse.lock end",
        "platform": [],
        "alias": null
      },
      {
        "name": "lock",
        "description": "Locks the mouse cursor to the window so it can't leave. Great for first-person games.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "Mouse.lock",
        "platform": [],
        "alias": null
      },
      {
        "name": "unlock",
        "description": "Unlocks the mouse cursor so it can move freely outside the window.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "Mouse.unlock",
        "platform": [],
        "alias": null
      },
      {
        "name": "cursor",
        "description": "Returns the current cursor icon type as an integer constant.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts Mouse.cursor",
        "platform": [],
        "alias": null
      },
      {
        "name": "cursor=",
        "description": "Sets the mouse cursor icon. Use Cursor constants like Cursor::CROSSHAIR or Cursor::POINTING_HAND.",
        "params": [{ "name": "icon", "type": "Integer", "description": "A Cursor constant" }],
        "returns": "nil",
        "raises": [],
        "example": "Mouse.cursor = Cursor::CROSSHAIR",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [
      { "name": "LEFT", "value": "0", "description": "Left mouse button." },
      { "name": "RIGHT", "value": "1", "description": "Right mouse button." },
      { "name": "MIDDLE", "value": "2", "description": "Middle mouse button (scroll wheel click)." }
    ],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/mouse.rb"
  },
  {
    "name": "Music",
    "type": "class",
    "description": "The Music class streams longer audio files like background music tracks. Supports WAV, OGG, FLAC, MP3, XM, and MOD formats.",
    "methods": [
      {
        "name": "to_h",
        "description": "Returns the music's properties as a Hash � context type, looping, frame count, volume, pitch.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p music.to_h",
        "platform": [],
        "alias": null
      },
      {
        "name": "play",
        "description": "Starts playing the music track.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "music.play",
        "platform": [],
        "alias": null
      },
      {
        "name": "stop",
        "description": "Stops playback.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "music.stop",
        "platform": [],
        "alias": null
      },
      {
        "name": "pause",
        "description": "Pauses playback for later resuming.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "music.pause",
        "platform": [],
        "alias": null
      },
      {
        "name": "resume",
        "description": "Resumes a paused music track.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "music.resume",
        "platform": [],
        "alias": null
      },
      {
        "name": "playing?",
        "description": "Returns true if the music is currently playing.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts music.playing?",
        "platform": [],
        "alias": null
      },
      {
        "name": "looping",
        "description": "Returns true if the music is set to loop.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts music.looping",
        "platform": [],
        "alias": null
      },
      {
        "name": "looping=",
        "description": "Sets whether the music should repeat when it finishes.",
        "params": [{ "name": "looping", "type": "Boolean", "description": "True to loop" }],
        "returns": "Boolean",
        "raises": [],
        "example": "music.looping = true",
        "platform": [],
        "alias": null
      },
      {
        "name": "volume=",
        "description": "Sets the playback volume. 1.0 is full, 0.0 is silent.",
        "params": [{ "name": "value", "type": "Float", "description": "Volume between 0.0 and 1.0" }],
        "returns": "Float",
        "raises": [],
        "example": "music.volume = 0.5",
        "platform": [],
        "alias": null
      },
      {
        "name": "pitch=",
        "description": "Sets the playback pitch/speed. 1.0 is normal speed.",
        "params": [{ "name": "value", "type": "Float", "description": "Pitch multiplier" }],
        "returns": "Float",
        "raises": [],
        "example": "music.pitch = 1.5",
        "platform": [],
        "alias": null
      },
      {
        "name": "update",
        "description": "Refills the music stream buffer. Call every frame while music is playing.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "music.update",
        "platform": [],
        "alias": null
      },
      {
        "name": "unload",
        "description": "Unloads the music from memory.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "music.unload",
        "platform": [],
        "alias": null
      },
      {
        "name": "valid?",
        "description": "Returns true if the music was loaded successfully.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "raise \"Bad music\" unless music.valid?",
        "platform": [],
        "alias": null
      },
      {
        "name": "mock_return",
        "description": "Used internally for generating mock data during testing.",
        "params": [
          { "name": "sample_rate: 0", "type": "any", "description": "Sample rate" },
          { "name": "sample_size: 0", "type": "any", "description": "Sample size" },
          { "name": "channels: 0", "type": "any", "description": "Channels" },
          { "name": "frame_count: 0", "type": "any", "description": "Frame count" },
          { "name": "looping: false", "type": "any", "description": "Looping flag" },
          { "name": "ctx_type: 0", "type": "any", "description": "Context type" }
        ],
        "returns": "String",
        "raises": [],
        "example": "",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [
      { "name": "Type", "description": "Music format constants � NONE, WAV, OGG, FLAC, MP3, XM, MOD." }
    ],
    "innerClasses": [
      { "name": "NotFoundError", "description": "Raised when the music file is not found." }
    ],
    "filename": "src/ruby/models/music.rb"
  },
  {
    "name": "Rectangle",
    "type": "class",
    "description": "The Rectangle class draws filled or outlined rectangles with optional rounded corners, scissoring to clip rendering, and hit-testing.",
    "methods": [
      {
        "name": "[]",
        "description": "Shorthand constructor � creates a new Rectangle in one line.",
        "params": [
          { "name": "x", "type": "Float", "description": "Top-left x" },
          { "name": "y", "type": "Float", "description": "Top-left y" },
          { "name": "width", "type": "Float", "description": "Width" },
          { "name": "height", "type": "Float", "description": "Height" },
          { "name": "colour: Colour::BLACK", "type": "any", "description": "Fill colour" }
        ],
        "returns": "Rectangle",
        "raises": [],
        "example": "rect = Rectangle[8, 16, 24, 32]",
        "platform": [],
        "alias": null
      },
      {
        "name": "to_h",
        "description": "Returns the rectangle's properties as a Hash � x, y, width, height, colour, outline, thickness, roundness, segments.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p rect.to_h",
        "platform": [],
        "alias": null
      },
      {
        "name": "scissor",
        "description": "Clips all drawing inside the block to the rectangle's bounds. Pixels outside won't render.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "rect.scissor do\n  # Only this rectangle area renders\nend",
        "platform": [],
        "alias": null
      },
      {
        "name": "overlaps?",
        "description": "Checks if a Vector2 point or another Rectangle overlaps with this rectangle.",
        "params": [{ "name": "other", "type": "Vector2 or Rectangle", "description": "The point or rectangle to test" }],
        "returns": "Boolean",
        "raises": ["ArgumentError"],
        "example": "hitbox.overlaps?(Vector2.new(x: 15, y: 15))",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/rectangle.rb"
  },
  {
    "name": "RenderTexture",
    "type": "class",
    "description": "The RenderTexture class lets you render graphics to an off-screen texture instead of the screen, useful for post-processing effects and caching complex draws.",
    "methods": [
      {
        "name": "texture",
        "description": "Returns the backing Texture2D. You can draw this texture to the screen like any other.",
        "params": [],
        "returns": "Texture2D",
        "raises": [],
        "example": "rt.texture.draw(position: Vector2[0, 0])",
        "platform": [],
        "alias": null,
        "isAttribute": true
      },
      {
        "name": "to_h",
        "description": "Returns width and height as a Hash.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p rt.to_h",
        "platform": [],
        "alias": null
      },
      {
        "name": "draw",
        "description": "Everything rendered inside the block goes to the off-screen texture instead of the screen.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "rt = RenderTexture.new(width: 640, height: 480)\nrt.draw do\n  # Render here\nend",
        "platform": [],
        "alias": null
      },
      {
        "name": "mock_return",
        "description": "Used internally for generating mock data during testing.",
        "params": [
          { "name": "width: 10", "type": "any", "description": "Width" },
          { "name": "height: 10", "type": "any", "description": "Height" }
        ],
        "returns": "String",
        "raises": [],
        "example": "",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/render_texture.rb"
  },
  {
    "name": "Shader",
    "type": "class",
    "description": "Load and apply GLSL shaders for GPU-accelerated visual effects, from file paths or inline code strings.",
    "methods": [
      {
        "name": "load",
        "description": "Loads a shader from file paths or inline code. Specify either paths or code, not both.",
        "params": [
          { "name": "vertex_shader_path: nil", "type": "any", "description": "Path to vertex shader" },
          { "name": "fragment_shader_path: nil", "type": "any", "description": "Path to fragment shader" },
          { "name": "vertex_shader_code: nil", "type": "any", "description": "Vertex shader source string" },
          { "name": "fragment_shader_code: nil", "type": "any", "description": "Fragment shader source string" }
        ],
        "returns": "Shader",
        "raises": ["ArgumentError"],
        "example": "shader = Shader.load(fragment_shader_path: \"./effects/glow.fs\")",
        "platform": [],
        "alias": null
      },
      {
        "name": "draw",
        "description": "Applies the shader effect to everything drawn inside the block.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "shader.draw do\n  # Affected drawing\nend",
        "platform": [],
        "alias": null
      },
      {
        "name": "set_shader_value",
        "description": "Sets a shader uniform value by name or location index.",
        "params": [
          { "name": "variable", "type": "String", "description": "Uniform variable name" },
          { "name": "value", "type": "any", "description": "The value to set" },
          { "name": "values: []", "type": "any", "description": "Multiple values as array" }
        ],
        "returns": "nil",
        "raises": [],
        "example": "shader.set_shader_value(variable: \"time\", value: [Time.now.to_f])",
        "platform": [],
        "alias": null
      },
      {
        "name": "unload",
        "description": "Unloads the shader from the GPU.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "shader.unload",
        "platform": [],
        "alias": null
      },
      {
        "name": "valid?",
        "description": "Returns true if the shader compiled and loaded successfully.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "raise \"Bad shader\" unless shader.valid?",
        "platform": [],
        "alias": null
      },
      {
        "name": "mock_return",
        "description": "Used internally for generating mock data during testing.",
        "params": [{ "name": "id: 1", "type": "any", "description": "Shader ID" }],
        "returns": "String",
        "raises": [],
        "example": "",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [
      { "name": "NotFoundError", "description": "Raised when the shader file is not found." }
    ],
    "filename": "src/ruby/models/shader.rb"
  },
  {
    "name": "Sound",
    "type": "class",
    "description": "The Sound class loads and plays short audio clips for sound effects, with control over volume and pitch.",
    "methods": [
      {
        "name": "to_h",
        "description": "Returns sound properties as a Hash � frame count, volume, pitch.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p sound.to_h",
        "platform": [],
        "alias": null
      },
      {
        "name": "play",
        "description": "Starts playing the sound effect.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "beep = Sound.new(\"./assets/beep.wav\")\nbeep.play",
        "platform": [],
        "alias": null
      },
      {
        "name": "stop",
        "description": "Stops the sound if it's playing.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "beep.stop",
        "platform": [],
        "alias": null
      },
      {
        "name": "pause",
        "description": "Pauses the sound so it can be resumed later.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "beep.pause",
        "platform": [],
        "alias": null
      },
      {
        "name": "resume",
        "description": "Resumes a paused sound.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "beep.resume",
        "platform": [],
        "alias": null
      },
      {
        "name": "playing?",
        "description": "Returns true if the sound is currently playing.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "puts beep.playing?",
        "platform": [],
        "alias": null
      },
      {
        "name": "volume=",
        "description": "Sets the sound volume. 1.0 is full, 0.0 is silent.",
        "params": [{ "name": "value", "type": "Float", "description": "Volume between 0.0 and 1.0" }],
        "returns": "Float",
        "raises": [],
        "example": "beep.volume = 0.5",
        "platform": [],
        "alias": null
      },
      {
        "name": "pitch=",
        "description": "Sets the playback pitch. 1.0 is normal, 2.0 is twice as fast.",
        "params": [{ "name": "value", "type": "Float", "description": "Pitch multiplier" }],
        "returns": "Float",
        "raises": [],
        "example": "beep.pitch = 1.5",
        "platform": [],
        "alias": null
      },
      {
        "name": "unload",
        "description": "Unloads the sound from memory.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "beep.unload",
        "platform": [],
        "alias": null
      },
      {
        "name": "valid?",
        "description": "Returns true if the sound loaded successfully.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "raise \"Bad sound\" unless beep.valid?",
        "platform": [],
        "alias": null
      },
      {
        "name": "frame_count",
        "description": "Returns the total frame count of the sound sample.",
        "params": [],
        "returns": "Integer",
        "raises": [],
        "example": "puts beep.frame_count",
        "platform": [],
        "alias": null
      },
      {
        "name": "mock_return",
        "description": "Used internally for generating mock data during testing.",
        "params": [{ "name": "frame_count: 1", "type": "any", "description": "Frame count" }],
        "returns": "String",
        "raises": [],
        "example": "",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [
      { "name": "NotFoundError", "description": "Raised when the sound file is not found." }
    ],
    "filename": "src/ruby/models/sound.rb"
  },
  {
    "name": "Texture2D",
    "type": "class",
    "description": "The Texture2D class is the primary way to draw sprites and images to the screen, with filtering modes from nearest-neighbour to anisotropic 16x.",
    "methods": [
      {
        "name": "to_h",
        "description": "Returns texture properties as a Hash � id, width, height, mipmaps, format.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p texture.to_h",
        "platform": [],
        "alias": null
      },
      {
        "name": "draw",
        "description": "Draws the texture to the screen with optional source rect, destination, rotation, origin, and tint colour.",
        "params": [
          { "name": "source: Rectangle[0, 0, width, height]", "type": "any", "description": "Source region within the texture" },
          { "name": "position: Vector2[0, 0]", "type": "any", "description": "Screen position" },
          { "name": "destination: Rectangle[position.x, position.y, source.width, source.height]", "type": "any", "description": "Destination for scaling" },
          { "name": "origin: Vector2[0, 0]", "type": "any", "description": "Rotation origin" },
          { "name": "rotation: 0", "type": "any", "description": "Rotation in degrees" },
          { "name": "colour: Colour::WHITE", "type": "any", "description": "Tint colour" }
        ],
        "returns": "nil",
        "raises": ["ArgumentError"],
        "example": "texture.draw(position: Vector2[100, 120], rotation: 90)",
        "platform": [],
        "alias": null
      },
      {
        "name": "unload",
        "description": "Unloads the texture from GPU memory.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "texture.unload",
        "platform": [],
        "alias": null
      },
      {
        "name": "valid?",
        "description": "Returns true if the texture is loaded on the GPU and valid.",
        "params": [],
        "returns": "Boolean",
        "raises": [],
        "example": "raise \"Bad texture\" unless texture.valid?",
        "platform": [],
        "alias": null
      },
      {
        "name": "filter=",
        "description": "Sets the texture filtering. NO_FILTER for pixel art, BILINEAR for smooth scaling.",
        "params": [{ "name": "val", "type": "Integer", "description": "Filter constant (NO_FILTER, BILINEAR, TRILINEAR, ANISOTROPIC_4X, etc)" }],
        "returns": "nil",
        "raises": ["ArgumentError"],
        "example": "texture.filter = Texture2D::BILINEAR",
        "platform": [],
        "alias": null
      },
      {
        "name": "generate_mipmaps",
        "description": "Generates mipmaps for better quality when rendering at smaller sizes.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "texture.generate_mipmaps",
        "platform": [],
        "alias": null
      },
      {
        "name": "mock_return",
        "description": "Used internally for generating mock data during testing.",
        "params": [
          { "name": "id: 1", "type": "any", "description": "Texture ID" },
          { "name": "width: 10", "type": "any", "description": "Width" },
          { "name": "height: 15", "type": "any", "description": "Height" },
          { "name": "mipmaps: 2", "type": "any", "description": "Mipmaps" },
          { "name": "format: 0", "type": "any", "description": "Format" }
        ],
        "returns": "String",
        "raises": [],
        "example": "",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [
      { "name": "NO_FILTER", "value": "0", "description": "Nearest-neighbour � best for pixel art." },
      { "name": "BILINEAR", "value": "1", "description": "Smooth bilinear filtering." },
      { "name": "TRILINEAR", "value": "2", "description": "Bilinear with mipmaps." },
      { "name": "ANISOTROPIC_4X", "value": "3", "description": "4x anisotropic filtering." },
      { "name": "ANISOTROPIC_8X", "value": "4", "description": "8x anisotropic filtering." },
      { "name": "ANISOTROPIC_16X", "value": "5", "description": "16x anisotropic � highest quality." }
    ],
    "innerModules": [],
    "innerClasses": [
      { "name": "NotFoundError", "description": "Raised when the texture file is not found." }
    ],
    "filename": "src/ruby/models/texture2d.rb"
  },
  {
    "name": "Touch",
    "type": "class",
    "description": "The Touch class handles multi-touch input on phones, tablets, and touch-enabled displays.",
    "methods": [
      {
        "name": "[]",
        "description": "Returns the touch position for the given finger index as a Vector2.",
        "params": [{ "name": "index", "type": "Integer", "description": "Finger index (0-based)" }],
        "returns": "Vector2",
        "raises": [],
        "example": "puts Touch[0]",
        "platform": [],
        "alias": null
      },
      {
        "name": "positions",
        "description": "Returns an array of all current touch positions as Vector2 values.",
        "params": [],
        "returns": "Array<Vector2>",
        "raises": ["Touch::TooManyTouchesError"],
        "example": "Touch.positions.each { |p| draw_circle(position: p, radius: 10) }",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [
      { "name": "MAX_TOUCH_POINTS", "value": "20", "description": "Maximum touch points before raising an error." }
    ],
    "innerModules": [],
    "innerClasses": [
      { "name": "TooManyTouchesError", "description": "Raised when more than MAX_TOUCH_POINTS touches are detected." }
    ],
    "filename": "src/ruby/models/touch.rb"
  },
  {
    "name": "Vector2",
    "type": "class",
    "description": "A 2D point or direction with x and y components, supporting arithmetic, scaling, length calculation, and overlap detection with rectangles.",
    "methods": [
      {
        "name": "[]",
        "description": "Shorthand constructor � creates a new Vector2 in one line.",
        "params": [
          { "name": "x", "type": "Float", "description": "X component" },
          { "name": "y", "type": "Float", "description": "Y component" }
        ],
        "returns": "Vector2",
        "raises": [],
        "example": "pos = Vector2[10, 12]",
        "platform": [],
        "alias": null
      },
      {
        "name": "==",
        "description": "Checks if two vectors have the same x and y values.",
        "params": [{ "name": "other", "type": "Vector2", "description": "The vector to compare" }],
        "returns": "Boolean",
        "raises": [],
        "example": "Vector2[3, 4] == Vector2[3, 4] # => true",
        "platform": [],
        "alias": null
      },
      {
        "name": "+",
        "description": "Adds another Vector2 or a Numeric value.",
        "params": [{ "name": "other", "type": "Vector2 or Numeric", "description": "Value to add" }],
        "returns": "Vector2",
        "raises": ["ArgumentError"],
        "example": "v = Vector2[1, 2] + Vector2[3, 4]",
        "platform": [],
        "alias": null
      },
      {
        "name": "-",
        "description": "Subtracts another Vector2 or a Numeric value. Also aliased as difference.",
        "params": [{ "name": "other", "type": "Vector2 or Numeric", "description": "Value to subtract" }],
        "returns": "Vector2",
        "raises": ["ArgumentError"],
        "example": "v = Vector2[3, 4] - Vector2[2, 1]",
        "platform": [],
        "alias": null
      },
      {
        "name": "*",
        "description": "Scales the vector by a Numeric value. Also aliased as scale.",
        "params": [{ "name": "other", "type": "Numeric", "description": "Scale factor" }],
        "returns": "Vector2",
        "raises": [],
        "example": "v = Vector2[2, 4] * 3",
        "platform": [],
        "alias": null
      },
      {
        "name": "/",
        "description": "Divides the vector by a Numeric value.",
        "params": [{ "name": "other", "type": "Numeric", "description": "Divisor" }],
        "returns": "Vector2",
        "raises": [],
        "example": "v = Vector2[2, 3] / 2",
        "platform": [],
        "alias": null
      },
      {
        "name": "length",
        "description": "Calculates the magnitude (length) of the vector.",
        "params": [],
        "returns": "Numeric",
        "raises": [],
        "example": "Vector2[3, 4].length # => 5",
        "platform": [],
        "alias": null
      },
      {
        "name": "to_h",
        "description": "Returns the vector as a Hash with :x and :y keys.",
        "params": [],
        "returns": "Hash",
        "raises": [],
        "example": "p Vector2[6, 8].to_h",
        "platform": [],
        "alias": null
      },
      {
        "name": "overlaps?",
        "description": "Checks if this point is inside another object that responds to overlaps? (like Rectangle).",
        "params": [{ "name": "other", "type": "Object#overlaps?", "description": "An object that supports overlaps?" }],
        "returns": "Boolean",
        "raises": ["ArgumentError"],
        "example": "Vector2.new(x: 15, y: 15).overlaps?(hitbox) # => true",
        "platform": [],
        "alias": null
      },
      {
        "name": "inspect",
        "description": "Returns a debug string like #<Vector2:0x... x:6.0 y:8.0>",
        "params": [],
        "returns": "String",
        "raises": [],
        "example": "puts Vector2[6, 8].inspect",
        "platform": [],
        "alias": null
      },
      {
        "name": "set",
        "description": "Sets both x and y values at once.",
        "params": [
          { "name": "x", "type": "Numeric", "description": "New x value" },
          { "name": "y", "type": "Numeric", "description": "New y value" }
        ],
        "returns": "Vector2",
        "raises": [],
        "example": "v = Vector2[0, 0]\nv.set(10, 20)",
        "platform": [],
        "alias": null
      },
      {
        "name": "draw",
        "description": "Draws a single pixel at this vector's position using the current drawing colour.",
        "params": [],
        "returns": "nil",
        "raises": [],
        "example": "Vector2.new(x: 16, y: 32).draw",
        "platform": [],
        "alias": null
      },
      {
        "name": "mock_return",
        "description": "Used internally for generating mock data during testing.",
        "params": [
          { "name": "x: 0", "type": "any", "description": "X value" },
          { "name": "y: 0", "type": "any", "description": "Y value" }
        ],
        "returns": "String",
        "raises": [],
        "example": "",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [
      { "name": "ZERO", "value": "Vector2.new(x: 0, y: 0)", "description": "A Vector2 at the origin (0, 0)." }
    ],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/vector2.rb"
  },
  {
    "name": "Vector3",
    "type": "class",
    "description": "A 3D point or direction with x, y, and z components, commonly used for device sensor data like accelerometers and gyroscopes.",
    "methods": [
      {
        "name": "[]",
        "description": "Shorthand constructor � creates a new Vector3 in one line.",
        "params": [
          { "name": "x", "type": "Float", "description": "X component" },
          { "name": "y", "type": "Float", "description": "Y component" },
          { "name": "z", "type": "Float", "description": "Z component" }
        ],
        "returns": "Vector3",
        "raises": [],
        "example": "v = Vector3[1, 2, 3]",
        "platform": [],
        "alias": null
      },
      {
        "name": "==",
        "description": "Checks if two vectors have the same x, y, and z values.",
        "params": [{ "name": "other", "type": "Vector3", "description": "The vector to compare" }],
        "returns": "Boolean",
        "raises": [],
        "example": "Vector3[1, 2, 3] == Vector3[1, 2, 3] # => true",
        "platform": [],
        "alias": null
      },
      {
        "name": "to_s",
        "description": "Returns a string like \"Vector3[1, 2, 3]\".",
        "params": [],
        "returns": "String",
        "raises": [],
        "example": "puts Vector3[1, 2, 3] # => Vector3[1, 2, 3]",
        "platform": [],
        "alias": null
      }
    ],
    "constants": [],
    "innerModules": [],
    "innerClasses": [],
    "filename": "src/ruby/models/vector3.rb"
  }
];
