import fs from "fs"
import path from "path"
import {isNumber} from "lodash"

export class AppStateFile {
  state: any = undefined

  constructor(public path: string) {
    if (this.path && fs.existsSync(path)) {
      this.state = JSON.parse(fs.readFileSync(this.path, "utf8"))
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
