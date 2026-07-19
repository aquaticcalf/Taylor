import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRightIcon, BookOpenIcon, CodeIcon, GamepadIcon } from "lucide-react"

export function Home() {
  return (
    <div className="mx-auto max-w-4xl space-y-12">
      {/* Hero section */}
      <section className="space-y-4 pt-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Taylor Game Framework
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          A simple, elegant Ruby game development framework built on the Mruby
          interpreter. Create 2D games with a clean API and fast iteration.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Button render={<NavLink to="/getting-started" />} size="lg">
            <BookOpenIcon className="mr-2 size-4" />
            Get Started
          </Button>
          <Button render={<NavLink to="/api" />} variant="outline" size="lg">
            <CodeIcon className="mr-2 size-4" />
            API Reference
          </Button>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <GamepadIcon className="mb-2 size-8 text-primary" />
            <CardTitle>2D Game Engine</CardTitle>
            <CardDescription>
              Built on raylib for fast 2D rendering with hardware acceleration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Draw sprites, handle input, play audio, and manage scenes with a
              clean Ruby DSL.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CodeIcon className="mb-2 size-8 text-primary" />
            <CardTitle>Ruby-Powered</CardTitle>
            <CardDescription>
              Write game logic in Ruby using the Mruby interpreter.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Fast iteration with a dynamic language. No compile step needed
              during development.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <BookOpenIcon className="mb-2 size-8 text-primary" />
            <CardTitle>Well Documented</CardTitle>
            <CardDescription>
              Comprehensive API documentation with examples for every method.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Every class and method includes usage examples, parameter docs,
              and return values.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Quick example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Example</h2>
        <div className="rounded-lg border bg-muted/50 p-4">
          <pre className="overflow-x-auto text-sm">
            <code>{`Window.open(width: 800, height: 600, title: "My Game")

Window.draw do
  Circle.draw(400, 300, 50, colour: Colour.new(255, 0, 0))
end`}</code>
          </pre>
        </div>
        <div className="flex">
          <Button render={<NavLink to="/api" />} variant="link" className="gap-1">
            Browse the API <ArrowRightIcon className="size-3" />
          </Button>
        </div>
      </section>
    </div>
  )
}
