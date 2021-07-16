import path from "path"
import lib from "../lib"
import BrimApi from "../api"
import {forEach} from "lodash"

interface PluginFunctions {
  activate(api: BrimApi): void
  deactivate(): Promise<void>
}

export default class PluginManager {
  private plugins: {
    [pluginName: string]: Plugin
  } = {}

  constructor(private api: BrimApi) {}

  async load(dir: string) {
    const files = await lib.file(dir).contents()
    for (let i = 0; i < files.length; i++) {
      const folder = path.join(dir, files[i])
      const plugin = new Plugin(folder)
      const error = await plugin.validate()
      if (error) {
        console.error(error)
      } else {
        plugin.load()
        await this.add(plugin)
      }
    }
  }

  activate() {
    forEach(this.plugins, (p) => p.activate(this.api))
  }

  async deactivate(): Promise<void> {
    await Promise.all(Object.values(this.plugins).map((p) => p.deactivate()))
  }

  private async add(plugin: Plugin) {
    if (this.plugins[plugin.name]) {
      console.error(
        new Error(`Duplicate or name collision for '${plugin.name}' plugin`)
      )
    } else {
      this.plugins[plugin.name] = plugin
    }
  }
}

class Plugin {
  name: string
  entryPoint: string
  functions: PluginFunctions

  constructor(public folderPath: string) {
    this.name = path.basename(folderPath)
    this.entryPoint = path.join(folderPath, this.indexFile())
  }

  async validate() {
    const d = lib.file(this.folderPath)
    if (!(await d.isDirectory())) {
      return "Plugin must be contained in a directory."
    }
    if (!lib.file(this.entryPoint).existsSync()) {
      return "Plugin directory must contain an index file as the entry point."
    }
    return null
  }

  load() {
    this.functions = require(this.entryPoint)
  }

  activate(api: BrimApi) {
    this.functions.activate(api)
  }

  deactivate() {
    if ("deactivate" in this.functions) {
      this.functions.deactivate()
    }
  }

  private indexFile() {
    if (process.env.BRIM_ITEST === "true") return "index.js"
    if (process.env.NODE_ENV === "test") return "index.ts"
    return "index.js"
  }
}
