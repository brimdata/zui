import fs from "fs"
import path from "path"
import {isNumber} from "lodash"

export class AppStateFile {
  state: any = undefined

  constructor(public path: string) {
    if (this.path && fs.existsSync(path)) {
      const contents = fs.readFileSync(this.path, "utf-8").toString()
      if (contents == "") return
      let object
      try {
        object = JSON.parse(fs.readFileSync(this.path, "utf8"))
      } catch (e) {
        throw new Error(
          "The application state file could not be parsed as JSON:\npath: " +
            this.path
        )
      }
      if (!object || typeof object !== "object" || !isNumber(object.version)) {
        throw new Error(
          "The application state file is a JSON object but is missing the top-level version key of type number\npath: " +
            this.path
        )
      }
      this.state = object
    }
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
}
