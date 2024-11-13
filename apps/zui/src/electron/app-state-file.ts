import fs from "fs"
import path from "path"
import {isNumber} from "lodash"

export class AppStateFile {
  state: any = undefined

  constructor(public path: string) {
    if (this.noFile) return
    if (this.noContent) return
    this.state = this.parse()
    if (this.noJSON) throw new Error(JSON_ERROR_MSG(this.path))
    if (this.noVersion) throw new Error(VERSION_ERROR_MSG(this.path))
  }

  create(version: number) {
    this.write({version, data: undefined})
  }

  write(state) {
    fs.writeFileSync(this.path, JSON.stringify(state))
    this.state = state
  }

  update(data) {
    this.write({version: this.version, data})
  }

  destroy() {
    if (fs.existsSync(this.path)) fs.rmSync(this.path)
  }

  get isEmpty() {
    return (
      !this.state ||
      typeof this.state != "object" ||
      !isNumber(this.state.version)
    )
  }

  get name() {
    return path.basename(this.path)
  }

  get version() {
    return this.state.version
  }

  get data() {
    return this.state.data
  }

  private get noFile() {
    return !fs.existsSync(this.path)
  }

  private get noContent() {
    return fs.statSync(this.path).size === 0
  }

  private get noJSON() {
    return !this.state
  }

  private get noVersion() {
    return !(typeof this.state === "object" && isNumber(this.state.version))
  }

  private parse() {
    try {
      return JSON.parse(fs.readFileSync(this.path, "utf8"))
    } catch {
      return null
    }
  }
}

const JSON_ERROR_MSG = (path) =>
  "The application state file could not be parsed as JSON:\npath: " + path

const VERSION_ERROR_MSG = (path) =>
  "The application state file is a JSON object but is missing the top-level version key of type number\npath: " +
  path
