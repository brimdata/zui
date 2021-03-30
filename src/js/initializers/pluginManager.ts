import path from "path"
import lib from "../lib"
import BrimApi from "./brimApi"

interface Plugin {
  activate(api: BrimApi): void

  deactivate(): void
}

export default class PluginManager {
  private plugins: Plugin[] = []

  constructor(private api: BrimApi) {}

  async load(dir: string) {
    const files = await lib.file(dir).contents()
    // TODO: Mason, find the files!
    console.log("files are: ", files)
    this.plugins.push(
      ...files.map((f) => {
        const {activate, deactivate = () => {}} = require(path.join(dir, f))
        return {
          activate,
          deactivate
        }
      })
    )
  }

  activate() {
    this.plugins.forEach((p) => p.activate(this.api))
  }

  deactivate() {
    this.plugins.forEach((p) => p.deactivate())
  }
}
