import { NavLink } from "react-router-dom"
import { apiModules } from "@/data/api"
import type { ApiModule } from "@/data/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const groupMeta: Record<string, { label: string; description: string }> = {
  Core: {
    label: "Core",
    description:
      "The essential modules for getting your game up and running — creating windows, managing your game loop, and configuring how everything works.",
  },
  Rendering: {
    label: "Rendering",
    description:
      "Everything you need to put pixels on the screen: shapes, colours, images, text, cameras, and shaders.",
  },
  Input: {
    label: "Input",
    description:
      "Respond to your players — keyboards, mice, gamepads, touch screens, and gestures.",
  },
  Media: {
    label: "Audio",
    description:
      "Sound effects and music playback to bring your game to life.",
  },
  Platform: {
    label: "Platform",
    description:
      "Interact with the player's system — clipboard, browser, file dialogs, device info, and more.",
  },
  Math: {
    label: "Math",
    description:
      "Vector math utilities for 2D and 3D calculations.",
  },
  Other: {
    label: "Other",
    description: "Modules that don't quite fit anywhere else.",
  },
}

const groupLabels: Record<string, string> = {
  Window: "Core",
  Audio: "Media",
  Music: "Media",
  Sound: "Media",
  Browser: "Platform",
  Clipboard: "Platform",
  Cursor: "Platform",
  Device: "Platform",
  DroppedFiles: "Platform",
  LocalStorage: "Platform",
  Logging: "Platform",
  Monitor: "Platform",
  Touch: "Input",
  Mouse: "Input",
  Key: "Input",
  Gamepad: "Input",
  Gesture: "Input",
  Camera2D: "Rendering",
  Circle: "Rendering",
  Colour: "Rendering",
  Font: "Rendering",
  Image: "Rendering",
  Line: "Rendering",
  Rectangle: "Rendering",
  RenderTexture: "Rendering",
  Shader: "Rendering",
  Texture2D: "Rendering",
  Vector2: "Math",
  Vector3: "Math",
}

export function ApiOverview() {
  const grouped: Record<string, ApiModule[]> = {}
  for (const mod of apiModules) {
    const group = groupLabels[mod.name] || "Other"
    if (!grouped[group]) grouped[group] = []
    grouped[group].push(mod)
  }

  const groupOrder = ["Core", "Rendering", "Input", "Media", "Platform", "Math", "Other"]

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">API Reference</h1>
        <p className="text-muted-foreground">
          Taylor organises its functionality into modules and classes. Browse
          them by category below, or jump straight to a specific module from the
          sidebar.
        </p>
      </section>

      {groupOrder.map((group) => {
        const modules = grouped[group]
        if (!modules) return null
        const meta = groupMeta[group]
        return (
          <section key={group} className="space-y-4">
            <h2 className="text-xl font-semibold">{meta?.label || group}</h2>
            {meta?.description && (
              <p className="text-sm text-muted-foreground">{meta.description}</p>
            )}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((mod) => (
                <NavLink key={mod.name} to={`/api/${mod.name.toLowerCase()}`}>
                  <Card className="h-full transition-colors hover:bg-accent/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{mod.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {mod.name === "Window"
                          ? "Main game window and rendering loop"
                          : mod.name === "Audio"
                            ? "Audio playback and streaming"
                            : mod.name === "Music"
                              ? "Music file playback"
                              : mod.name === "Sound"
                                ? "Sound effect playback"
                                : mod.name === "Browser"
                                  ? "Web browser integration"
                                  : mod.name === "Clipboard"
                                    ? "System clipboard access"
                                    : mod.name === "Cursor"
                                      ? "Mouse cursor control"
                                      : mod.name === "Device"
                                        ? "Device information"
                                        : mod.name === "DroppedFiles"
                                          ? "File drag-and-drop handling"
                                          : mod.name === "LocalStorage"
                                            ? "Persistent local storage"
                                            : mod.name === "Logging"
                                              ? "Logging and debug output"
                                              : mod.name === "Monitor"
                                                ? "Display monitor information"
                                                : mod.name === "Touch"
                                                  ? "Touch screen input"
                                                  : mod.name === "Mouse"
                                                    ? "Mouse input and position"
                                                    : mod.name === "Key"
                                                      ? "Keyboard input"
                                                      : mod.name === "Gamepad"
                                                        ? "Gamepad/controller input"
                                                        : mod.name === "Gesture"
                                                          ? "Gesture recognition"
                                                          : mod.name === "Camera2D"
                                                            ? "2D camera system"
                                                            : mod.name === "Circle"
                                                              ? "Circle drawing"
                                                              : mod.name === "Colour"
                                                                ? "Color creation and management"
                                                                : mod.name === "Font"
                                                                  ? "Font loading and text rendering"
                                                                  : mod.name === "Image"
                                                                    ? "Image loading and drawing"
                                                                    : mod.name === "Line"
                                                                      ? "Line drawing"
                                                                      : mod.name === "Rectangle"
                                                                        ? "Rectangle drawing"
                                                                        : mod.name === "RenderTexture"
                                                                          ? "Off-screen rendering"
                                                                          : mod.name === "Shader"
                                                                            ? "Shader effects"
                                                                            : mod.name === "Texture2D"
                                                                              ? "Texture management"
                                                                              : mod.name === "Vector2"
                                                                                ? "2D vector math"
                                                                                : mod.name === "Vector3"
                                                                                  ? "3D vector math"
                                                                                  : mod.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {mod.type}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {mod.methods.length} methods
                        </Badge>
                        {mod.constants.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {mod.constants.length} constants
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </NavLink>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
