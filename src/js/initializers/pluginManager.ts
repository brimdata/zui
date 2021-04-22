import path from "path"
import lib from "../lib"
import BrimApi from "../api"

interface Plugin {
  activate(api: BrimApi): void

  deactivate(): void
}

export default class PluginManager {
  private plugins: Plugin[] = []

  constructor(private api: BrimApi) {}

  async load(dir: string) {
    const files = await lib.file(dir).contents()

    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      const pluginDir = lib.file(path.join(dir, f))
      if (!(await pluginDir.isDirectory())) {
        console.error("Plugin must be contained in a directory.")
        return
      }

      const entryPoint = path.join(dir, pluginDir.fileName(), "index.js")
      if (!lib.file(entryPoint).existsSync()) {
        console.error(
          "Plugin directory must contain an index file as the entry point."
        )
        return
      }

      const {activate, deactivate = () => {}} = require(entryPoint)
      this.plugins.push({activate, deactivate})
    }
  }

  activate() {
    this.plugins.forEach((p) => p.activate(this.api))
  }

  deactivate() {
    this.plugins.forEach((p) => p.deactivate())
  }
}
