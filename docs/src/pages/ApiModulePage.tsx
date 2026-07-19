import { useParams, NavLink } from "react-router-dom"
import { apiModules } from "@/data/api"
import type { ApiMethod } from "@/data/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeftIcon, TerminalIcon, AlertTriangleIcon } from "lucide-react"

function clean(desc: string): string {
  if (!desc) return ""
  return desc
    .replace(/@example\s[^]*?(?=@|\n\s*\n|$)/g, "")
    .replace(/@param\s+\w+\s*(\[[^\]]*\])?[^]*?(?=@|\n\s*\n|$)/g, "")
    .replace(/@return\s+\[[^\]]*\][^]*?(?=@|\n\s*\n|$)/g, "")
    .replace(/@raise\s+\[[^\]]*\][^]*?(?=@|\n\s*\n|$)/g, "")
    .replace(/@yieldparam\s+\w+\s*\[[^\]]*\][^]*?(?=@|\n\s*\n|$)/g, "")
    .replace(/@yield\s[^]*?(?=@|\n\s*\n|$)/g, "")
    .replace(/@note\s[^]*?(?=@|\n\s*\n|$)/g, "")
    .replace(/@!method[^]*?(?=@|\n\s*\n|$)/g, "")
    .replace(/@!attribute[^]*?(?=@|\n\s*\n|$)/g, "")
    .replace(/@!group[^]*?(?=@|\n\s*\n|$)/g, "")
    .replace(/@!endgroup[^]*?(?=@|\n\s*\n|$)/g, "")
    .replace(/\{([^}]+)\}/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export function ApiModulePage() {
  const { moduleName } = useParams<{ moduleName: string }>()
  const mod = apiModules.find(
    (m) => m.name.toLowerCase() === moduleName?.toLowerCase()
  )

  if (!mod) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold">Module not found</h1>
        <p className="text-muted-foreground">
          The module "{moduleName}" does not exist in the API reference.
        </p>
        <NavLink
          to="/api"
          className="inline-flex items-center gap-1 text-sm text-primary underline underline-offset-4"
        >
          <ArrowLeftIcon className="size-3" />
          Back to API overview
        </NavLink>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <section className="space-y-2">
        <NavLink
          to="/api"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3" />
          API Reference
        </NavLink>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{mod.name}</h1>
          <Badge variant="secondary">{mod.type}</Badge>
        </div>
        {mod.description && (
          <p className="text-muted-foreground">{clean(mod.description)}</p>
        )}
      </section>

      {mod.innerModules.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Sub-modules</h2>
          <div className="flex flex-wrap gap-2">
            {mod.innerModules.map((im) => (
              <Badge key={im.name} variant="outline" className="text-sm">
                {mod.name}::{im.name}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {mod.innerClasses.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Inner Classes</h2>
          <div className="flex flex-wrap gap-2">
            {mod.innerClasses.map((ic) => (
              <Badge key={ic.name} variant="outline" className="text-sm">
                {mod.name}::{ic.name}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {mod.constants.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Constants</h2>
          <div className="grid gap-2">
            {mod.constants.map((c) => (
              <Card key={c.name}>
                <CardHeader className="py-3">
                  <div className="flex items-baseline gap-3">
                    <code className="rounded bg-muted px-2 py-0.5 text-sm font-semibold">
                      {mod.name}::{c.name}
                    </code>
                    <span className="text-sm text-muted-foreground">
                      = {c.value}
                    </span>
                  </div>
                  {c.description && (
                    <CardDescription>{c.description}</CardDescription>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      )}

      {mod.methods.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Methods</h2>
          {mod.methods.map((method) => (
            <MethodCard
              key={method.name}
              method={method}
              moduleName={mod.name}
            />
          ))}
        </section>
      )}

      {mod.methods.length === 0 && mod.constants.length === 0 && (
        <p className="text-muted-foreground">
          No documented methods or constants for this module.
        </p>
      )}
    </div>
  )
}

const allPlatforms = [
  { id: "windows", label: "Windows" },
  { id: "linux", label: "Linux" },
  { id: "osx", label: "macOS" },
  { id: "android", label: "Android" },
  { id: "web", label: "Web" },
] as const

function MethodCard({
  method,
  moduleName,
}: {
  method: ApiMethod
  moduleName: string
}) {
  const hasParams = method.params && method.params.length > 0
  const hasReturns = !!method.returns && method.returns !== "void"
  const hasRaises = method.raises && method.raises.length > 0
  const hasExample = !!method.example
  const isAllPlatforms = !method.platform || method.platform.length === 0
  const supportedPlatforms = isAllPlatforms
    ? allPlatforms
    : allPlatforms.filter((p) => method.platform.includes(p.id))

  const sigParams = method.params.map((p) => {
    let s = p.name
    if (p.default) s += ` = ${p.default}`
    return s
  }).join(", ")

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="font-mono text-base break-words">
            {method.isAttribute ? (
              <>{method.name}</>
            ) : (
              <>{method.name}({sigParams})</>
            )}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-1">
            {hasReturns && (
              <Badge variant="secondary" className="text-xs font-mono">
                → {method.returns}
              </Badge>
            )}
            {method.alias && (
              <Badge variant="outline" className="text-xs">
                alias {method.alias}
              </Badge>
            )}
          </div>
        </div>
        {method.description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {clean(method.description)}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Platforms
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {supportedPlatforms.map((p) => (
              <Badge
                key={p.id}
                variant={isAllPlatforms ? "secondary" : "outline"}
                className="text-xs capitalize"
              >
                {p.label}
              </Badge>
            ))}
            {!isAllPlatforms && (
              <span className="text-xs text-muted-foreground self-center ml-1">
                only
              </span>
            )}
          </div>
        </div>

        {hasParams && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Parameters
            </h4>
            <div className="space-y-1.5">
              {method.params.map((param) => (
                <div
                  key={param.name}
                  className="flex flex-wrap items-baseline gap-x-2 text-sm"
                >
                  <code className="font-semibold">{param.name}</code>
                  <span className="text-xs text-muted-foreground">
                    {param.type}
                  </span>
                  {param.default && (
                    <span className="text-xs text-muted-foreground">
                      default: {param.default}
                    </span>
                  )}
                  {param.description && (
                    <span className="w-full text-xs text-muted-foreground">
                      {param.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {hasReturns && (
          <div className="flex items-baseline gap-2 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Returns
            </span>
            <code className="text-xs">{method.returns}</code>
          </div>
        )}

        {hasRaises && (
          <div className="space-y-1.5">
            <h4 className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-destructive">
              <AlertTriangleIcon className="size-3" />
              Raises
            </h4>
            {method.raises.map((raise: string, idx: number) => (
              <div key={idx} className="text-sm">
                <code className="text-xs text-destructive">{raise}</code>
              </div>
            ))}
          </div>
        )}

        {hasExample && (
          <div className="space-y-1.5">
            <h4 className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <TerminalIcon className="size-3" />
              Example
            </h4>
            <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
              <code>{method.example}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
