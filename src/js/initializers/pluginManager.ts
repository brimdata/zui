import {forEach} from "lodash"
import path from "path"
import ZuiApi from "../api/zui-api"
import file from "../lib/file"

interface PluginFunctions {
  activate(api: ZuiApi): void
  deactivate(api: ZuiApi): Promise<void>
}

export default class PluginManager {
  private plugins: {
    [pluginName: string]: Plugin
  } = {}

  constructor(private api: ZuiApi) {}

  async load(dir: string) {
    const files = await file(dir).contents()
    for (let i = 0; i < files.length; i++) {
      const folder = path.join(dir, files[i])
      const plugin = new Plugin(folder)
      try {
        await plugin.load()
        this.add(plugin)
      } catch (e) {
        console.error(e)
      }
    }
  }

  activate() {
    forEach(this.plugins, (p) => p.activate(this.api))
  }

  async deactivate(): Promise<void> {
    await Promise.all(
      Object.values(this.plugins).map((p) => p.deactivate(this.api))
    )
  }

  private add(plugin: Plugin) {
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
    this.entryPoint = path.join(folderPath, "index")
  }

  async load() {
    const d = file(this.folderPath)
    if (!(await d.isDirectory())) {
      throw new Error("Plugin must be contained in a directory.")
    }
    try {
      this.functions = require(this.entryPoint)
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        throw new Error(
          `Plugin directory ${this.folderPath} must contain an index file as the entry point.`
        )
      }
      throw e
    }
  }

  activate(api: ZuiApi) {
    this.functions.activate(api)
  }

  deactivate(api: ZuiApi) {
    if ("deactivate" in this.functions) {
      this.functions.deactivate(api)
    }
  }
}
