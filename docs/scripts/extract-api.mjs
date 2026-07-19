import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mainModelsDir = path.resolve(__dirname, "../../src/ruby/models")
const docModelsDir = path.resolve(__dirname, "../../mrb_doc/models")
const outputFile = path.resolve(__dirname, "../src/data/api.ts")

function parseRubyYard(filePath) {
  const content = fs.readFileSync(filePath, "utf-8")
  const filename = path.basename(filePath, ".rb")
  const lines = content.split("\n")

  // Module/class name
  const classMatch = content.match(/^(?:class|module) (\w+)/m)
  const type = content.match(/^module /m) ? "module" : "class"
  let name = classMatch ? classMatch[1] : filename

  // If no explicit class/module definition, try to infer from Module::CONSTANT patterns
  if (!classMatch) {
    const namespaceMatch = content.match(/^(\w+)::\w+ = /m)
    if (namespaceMatch) {
      name = namespaceMatch[1]
    }
  }

  // First block comment (module/class description)
  const description = extractDescription(lines, 0)

  // Parse all methods, constants, inner classes/modules
  const methods = []
  const constants = []
  const innerModules = []
  const innerClasses = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Method definitions
    const methodMatch = trimmed.match(/^def (?:self\.)?(\w+(?:[?!=])?)(?:\((.+)\))?/)
    if (methodMatch) {
      const methodName = methodMatch[1]
      const params = methodMatch[2] || ""
      const desc = extractDescription(lines, i)

      // Check for `@!method` documentation directives before
      const docDirectives = extractDocDirectives(lines, i)

      const returnTag = docDirectives.returnTag
      const returns = returnTag
        ? (typeof returnTag === "object" ? returnTag.type : returnTag)
        : parseReturnType(desc)

      const raiseTags = docDirectives.raiseTags || []
      const raises = raiseTags.map(r => typeof r === "object" ? r.type : r)

      methods.push({
        name: methodName,
        description: desc || docDirectives.description,
        params: parseParams(params, docDirectives.paramTags),
        returns,
        raises,
        example: parseExample(desc),
        platform: docDirectives.platform || parsePlatform(desc),
        alias: docDirectives.aliasMatch,
      })
    }

    // Constants (UPPERCASE = value, including Key::CONSTANT style and indented inside class/module blocks)
    const constMatch = trimmed.match(/^(?:(\w+)::)?(\w+) = /)
    if (constMatch) {
      const constModule = constMatch[1] || name
      const constName = constMatch[2]
      // Only capture if the constant is all uppercase or snake_case uppercase
      // Ensure it either matches the current module OR is a top-level constant
      if (constName === constName.toUpperCase() && constModule === name) {
        // Check for comment above
        const prevLine = i > 0 ? lines[i - 1].trim() : ""
        const description = prevLine.startsWith("#") ? prevLine.replace(/^#\s*/, "") : ""
        constants.push({
          name: constName,
          value: trimmed.split("=")[1]?.trim() || "",
          description,
        })
      }
    }

    // Inner classes/modules
    const innerClassMatch = trimmed.match(/^(?:class|module) (\w+)/)
    if (innerClassMatch && line.includes(" end") === false) {
      // Simple inner class/module
      if (name !== innerClassMatch[1]) {
        const item = {
          name: innerClassMatch[1],
          description: extractDescription(lines, i),
        }
        if (trimmed.startsWith("module")) {
          innerModules.push(item)
        } else {
          innerClasses.push(item)
        }
      }
    }

    // Special handling: attr_reader and attr_accessor
    const attrMatch = trimmed.match(/^attr_(?:reader|accessor|writer) :(\w+)/)
    if (attrMatch) {
      methods.push({
        name: attrMatch[1],
        description: extractDescription(lines, i),
        params: [],
        returns: "any",
        raises: [],
        example: "",
        platform: [],
        alias: null,
        isAttribute: true,
      })
    }

    i++
  }

  // Second pass: collect @!method directives that didn't have a corresponding def line.
  // These are methods defined in C++ (via mruby) but documented via YARD directives.
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    const methodDirective = trimmed.match(/^#\s*@!method\s+(?:self\.)?(\w+(?:[?!=])?)/)
    if (methodDirective) {
      const methodName = methodDirective[1]
      // Only add if not already captured by a def line
      if (!methods.some(m => m.name === methodName)) {
        // Collect subsequent comment lines for documentation,
        // stopping at the next @!method or non-comment line
        let j = i + 1
        let docLines = [trimmed.replace(/^#\s*/, "")]
        while (j < lines.length) {
          const nextLine = lines[j].trim()
          if (nextLine.startsWith("#") && !nextLine.match(/@!method/)) {
            docLines.push(nextLine.replace(/^#\s*/, ""))
            j++
          } else {
            break
          }
        }

        const fullText = docLines.join("\n")
        const description = docLines
          .filter(c => !c.startsWith("@") && !c.match(/^@/))
          .join(" ")
          .trim()

        // Parse @return
        let returns = "void"
        for (const docLine of docLines) {
          const returnMatch = docLine.match(/@return\s+\[([^\]]+)\]/)
          if (returnMatch) {
            returns = returnMatch[1]
            break
          }
        }

        // Parse @param tags
        const paramTags = []
        for (const docLine of docLines) {
          const paramMatch = docLine.match(/@param\s+(\w+)\s+\[([^\]]+)\](.*)/)
          if (paramMatch) {
            paramTags.push({
              name: paramMatch[1],
              type: paramMatch[2],
              description: paramMatch[3].trim(),
            })
          }
        }

        // Parse @yieldparam tags
        const yieldParams = []
        for (const docLine of docLines) {
          const yieldMatch = docLine.match(/@yieldparam\s+(\w+)\s+\[([^\]]+)\](.*)/)
          if (yieldMatch) {
            yieldParams.push({
              name: yieldMatch[1],
              type: yieldMatch[2],
              description: yieldMatch[3].trim(),
            })
          }
        }

        // Parse @raise tags
        const raises = []
        for (const docLine of docLines) {
          const raiseMatch = docLine.match(/@raise\s+\[([^\]]+)\](.*)/)
          if (raiseMatch) {
            raises.push(raiseMatch[1])
          }
        }

        // Parse @yield (simple description)
        let yieldDesc = ""
        for (const docLine of docLines) {
          const yieldMatch = docLine.match(/@yield\s+(.*)/)
          if (yieldMatch) {
            yieldDesc = yieldMatch[1]
            break
          }
        }

        const params = []
        params.push(...yieldParams.map(yp => ({
          name: yp.name,
          type: yp.type,
          description: yp.description,
        })))
        params.push(...paramTags.map(pt => ({
          name: pt.name,
          type: pt.type,
          description: pt.description,
        })))

        methods.push({
          name: methodName,
          description,
          params,
          returns,
          raises,
          example: "",
          platform: [],
          alias: null,
        })
      }
    }
  }

  return {
    name,
    type,
    description,
    methods,
    constants,
    innerModules,
    innerClasses,
    filename,
  }
}

function extractDescription(lines, startIdx) {
  // Look backward from startIdx for comment block
  let commentLines = []
  let i = startIdx - 1
  while (i >= 0) {
    const trimmed = lines[i].trim()
    if (trimmed.startsWith("#")) {
      commentLines.unshift(trimmed.replace(/^#\s*/, ""))
    } else if (trimmed === "" && commentLines.length === 0) {
      // skip blank lines before comments
    } else {
      break
    }
    i--
  }
  return commentLines.join(" ").trim()
}

function extractDocDirectives(lines, startIdx) {
  // Look for @!method directives and YARD tags in comments above
  let i = startIdx - 1
  let comments = []
  while (i >= 0) {
    const trimmed = lines[i].trim()
    if (trimmed.startsWith("#")) {
      comments.unshift(trimmed.replace(/^#\s*/, ""))
    } else if (trimmed === "" && comments.length === 0) {
      // skip
    } else {
      break
    }
    i--
  }

  const fullText = comments.join("\n")
  const result = {
    description: "",
    paramTags: [],
    returnTag: null,
    raiseTags: [],
    platform: [],
    aliasMatch: null,
  }

  for (const comment of comments) {
    // @!method directives
    const methodDirective = comment.match(/@!method\s+(?:self\.)?(\w+)/)
    if (methodDirective) {
      result.aliasMatch = methodDirective[1]
    }

    // @param tags
    const paramMatch = comment.match(/@param\s+(\w+)\s+\[([^\]]+)\](.*)/)
    if (paramMatch) {
      result.paramTags.push({
        name: paramMatch[1],
        type: paramMatch[2],
        description: paramMatch[3].trim(),
      })
    }

    // @return tags
    const returnMatch = comment.match(/@return\s+\[([^\]]+)\](.*)/)
    if (returnMatch) {
      result.returnTag = {
        type: returnMatch[1],
        description: returnMatch[2].trim(),
      }
    }

    // @raise tags
    const raiseMatch = comment.match(/@raise\s+\[([^\]]+)\](.*)/)
    if (raiseMatch) {
      result.raiseTags.push({
        type: raiseMatch[1],
        description: raiseMatch[2].trim(),
      })
    }

    // @yieldparam / @yield
    const yieldMatch = comment.match(/@yieldparam\s+(\w+)\s+\[([^\]]+)\](.*)/)
    if (yieldMatch) {
      result.yieldParams = result.yieldParams || []
      result.yieldParams.push({
        name: yieldMatch[1],
        type: yieldMatch[2],
        description: yieldMatch[3].trim(),
      })
    }

    // @note
    if (comment.includes("@note ")) {
      result.note = comment.replace(/@note\s+/, "").trim()
    }
  }

  // Check for platform info in description
  const platformKeywords = ["primarily Android", "only available for Web", "web exports", "on non-web", "on Android"]
  for (const kw of platformKeywords) {
    if (fullText.toLowerCase().includes(kw.toLowerCase())) {
      if (kw.includes("Android")) result.platform.push("android")
      if (kw.includes("Web") || kw.includes("web")) result.platform.push("web")
    }
  }

  // Extract description (non-tag lines)
  result.description = comments
    .filter(c => !c.startsWith("@") && !c.match(/^@/))
    .join(" ")
    .trim()

  return result
}

function parseParams(paramsStr, paramTags) {
  if (!paramsStr) return []
  const params = paramsStr.split(",").map(p => {
    const [name, defaultValue] = p.trim().split("=").map(s => s.trim())
    return {
      name: name || "",
      type: paramTags.find(t => t.name === name)?.type || "any",
      default: defaultValue || undefined,
      description: paramTags.find(t => t.name === name)?.description || "",
    }
  })
  return params
}

function parseReturnType(desc) {
  const match = desc.match(/@return \[([^\]]+)\]/)
  return match ? match[1] : "void"
}

function parseExample(desc) {
  const lines = desc.split("\n")
  const exampleIdx = lines.findIndex(l => l.includes("@example"))
  if (exampleIdx === -1) return ""
  // Collect example lines until next tag
  const exampleLines = []
  for (let i = exampleIdx + 1; i < lines.length; i++) {
    if (lines[i].trim().startsWith("@")) break
    exampleLines.push(lines[i].trim())
  }
  return exampleLines.join("\n")
}

function parsePlatform(desc) {
  const platforms = []
  const lower = desc.toLowerCase()
  if (lower.includes("android")) platforms.push("android")
  if (lower.includes("web") || lower.includes("browser") || lower.includes("localstorage")) platforms.push("web")
  return platforms
}

// Main extraction
const modules = []

// Order matters for the sidebar - use a specific order
const order = [
  "window.rb", "audio.rb", "browser.rb", "camera2d.rb", "circle.rb",
  "clipboard.rb", "colour.rb", "cursor.rb", "device.rb", "dropped_files.rb",
  "font.rb", "gamepad.rb", "gesture.rb", "image.rb", "key.rb",
  "line.rb", "local_storage.rb", "logging.rb", "monitor.rb", "mouse.rb",
  "music.rb", "rectangle.rb", "render_texture.rb", "shader.rb", "sound.rb",
  "texture2d.rb", "touch.rb", "vector2.rb", "vector3.rb",
]

for (const filename of order) {
  // Prefer mrb_doc/models/ for more complete documentation, then fall back to src/ruby/models/
  const docFilepath = path.join(docModelsDir, filename)
  const mainFilepath = path.join(mainModelsDir, filename)
  const hasDocFile = fs.existsSync(docFilepath)
  const hasMainFile = fs.existsSync(mainFilepath)

  if (hasDocFile) {
    try {
      const data = parseRubyYard(docFilepath)
      // If the main source file also exists, merge its constants into the doc data
      // (doc files may omit constants defined in the actual source)
      if (hasMainFile) {
        const mainData = parseRubyYard(mainFilepath)
        for (const mc of mainData.constants) {
          if (!data.constants.some(c => c.name === mc.name)) {
            data.constants.push(mc)
          }
        }
        // Also merge inner classes/modules that might be in the source but not in docs
        for (const ic of mainData.innerClasses) {
          if (!data.innerClasses.some(c => c.name === ic.name)) {
            data.innerClasses.push(ic)
          }
        }
        for (const im of mainData.innerModules) {
          if (!data.innerModules.some(m => m.name === im.name)) {
            data.innerModules.push(im)
          }
        }
      }
      modules.push(data)
      console.log(`Extracted: ${data.name}`)
    } catch (e) {
      console.error(`Error parsing ${filename}: ${e.message}`)
    }
  } else if (hasMainFile) {
    try {
      const data = parseRubyYard(mainFilepath)
      modules.push(data)
      console.log(`Extracted: ${data.name}`)
    } catch (e) {
      console.error(`Error parsing ${filename}: ${e.message}`)
    }
  } else {
    console.warn(`Warning: ${filename} not found in either directory`)
  }
}

// Generate TypeScript output
let tsOutput = `// Auto-generated from Ruby source files. Do not edit directly.
// Generated at: ${new Date().toISOString()}

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

export const apiModules: ApiModule[] = ${JSON.stringify(modules, null, 2)}
`

fs.writeFileSync(outputFile, tsOutput, "utf-8")
console.log(`\nWrote ${modules.length} modules to ${outputFile}`)
