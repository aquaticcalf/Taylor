import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

export function GettingStarted() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Getting Started</h1>
        <p className="text-muted-foreground text-lg">
          So you want to make a game with Taylor? Let's get you up and running.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Download the Engine</h2>
        <p>
          Taylor is a standalone game engine — you download a binary, write Ruby code, and run it.
          Grab the latest release for your platform from the{" "}
          <a
            href="https://github.com/HellRok/Taylor/releases"
            className="font-medium text-primary underline underline-offset-4"
          >
            GitHub releases page
          </a>
          .
        </p>
        <p className="text-sm text-muted-foreground">
          The <code>taylor</code> binary includes everything: the mruby interpreter, the raylib
          renderer, audio, input — all in one file. No gems, no dependencies, no setup scripts.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Create a Project</h2>
        <p>Use the <code>new</code> command to scaffold a new game:</p>
        <div className="rounded-lg border bg-muted/50 p-4">
          <pre className="overflow-x-auto text-sm">
            <code>{`taylor new my_game
cd my_game`}</code>
          </pre>
        </div>
        <p>
          This creates a <code>game.rb</code> entrypoint and a <code>taylor-config.json</code>.
          Open <code>game.rb</code> and start coding.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Run Your Game</h2>
        <p>Pass your entrypoint to the Taylor binary:</p>
        <div className="rounded-lg border bg-muted/50 p-4">
          <pre className="overflow-x-auto text-sm">
            <code>{`taylor game.rb`}</code>
          </pre>
        </div>
        <p className="text-sm text-muted-foreground">
          If you're in a project directory with a <code>taylor-config.json</code>, just running{" "}
          <code>taylor</code> without arguments works too — it reads the <code>entrypoint</code> from
          the config file.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Your First Window</h2>
        <p>
          Taylor pre-loads all its modules into the Ruby VM automatically — no <code>require</code>{" "}
          statements needed. Every Taylor game starts the same way:
        </p>
        <div className="rounded-lg border bg-muted/50 p-4">
          <pre className="overflow-x-auto text-sm">
            <code>{`Window.open(width: 800, height: 600, title: "Hello, Taylor!")

Window.draw do
  # Your rendering code goes here
end`}</code>
          </pre>
        </div>
        <p className="text-sm text-muted-foreground">
          Everything inside <code>Window.draw</code> runs every frame — think of it as the frame
          loop body. You'll typically wrap it in a <code>main</code> method and loop until the
          window closes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">A Complete Game Loop</h2>
        <p>
          Here's a minimal but complete game skeleton with a proper main loop:
        </p>
        <div className="rounded-lg border bg-muted/50 p-4">
          <pre className="overflow-x-auto text-sm">
            <code>{`Window.open(width: 800, height: 600, title: "Shapes")
Audio.open
Window.target_frame_rate = Monitor.current.refresh_rate

def main
  delta = Window.frame_time

  Window.draw do
    Window.clear(colour: Colour::RAYWHITE)

    # Red circle at center
    Circle.draw(400, 300, 50, colour: Colour.new(255, 0, 0))

    # Blue rectangle in the corner
    Rectangle.draw(100, 100, 200, 150, colour: Colour.new(0, 0, 255))

    # Green line across the screen
    Line.draw(0, 300, 800, 300, 5, colour: Colour.new(0, 255, 0))

    # Display some text
    Font.default.draw("Hello, Taylor!", x: 10, y: 10, size: 20)
  end
end

if Taylor::Platform.browser?
  Browser.main_loop = "main"
else
  main until Window.close?
end

Audio.close
Window.close`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Handling Input</h2>
        <p>
          Use the{" "}
          <NavLink to="/api/key" className="font-medium text-primary underline underline-offset-4">
            Key
          </NavLink>{" "}
          and{" "}
          <NavLink to="/api/mouse" className="font-medium text-primary underline underline-offset-4">
            Mouse
          </NavLink>{" "}
          modules inside your draw block:
        </p>
        <div className="rounded-lg border bg-muted/50 p-4">
          <pre className="overflow-x-auto text-sm">
            <code>{`x = 400
y = 300

Window.draw do
  x -= 5 if Key.down?(Key::LEFT)
  x += 5 if Key.down?(Key::RIGHT)
  y -= 5 if Key.down?(Key::UP)
  y += 5 if Key.down?(Key::DOWN)

  Circle.draw(x, y, 20, colour: Colour::WHITE)

  Window.close if Key.pressed?(Key::ESCAPE)
end`}</code>
          </pre>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Export Your Game</h2>
        <p>
          When you're ready to ship, Taylor can compile your game into standalone executables for
          Windows, Linux, macOS, Web (WASM), and Android:
        </p>
        <div className="rounded-lg border bg-muted/50 p-4">
          <pre className="overflow-x-auto text-sm">
            <code>{`# Requires Docker
taylor export`}</code>
          </pre>
        </div>
        <p className="text-sm text-muted-foreground">
          The export command uses Docker containers to cross-compile for each target platform.
          Configure which platforms to build in your <code>taylor-config.json</code>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What's Next?</h2>
        <p>
          That's the basics! From here you can dive into the full API reference
          to learn about all the modules and methods Taylor has to offer.
        </p>
        <Button render={<NavLink to="/api" />}>
          Browse API Reference <ArrowRightIcon className="ml-2 size-4" />
        </Button>
      </section>
    </div>
  )
}
