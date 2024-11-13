import path from "path"
import fs from "fs"
import {AppStateFile} from "./app-state-file"
import {plusOne} from "src/util/plus-one"

export class AppStateBackup {
  constructor(public dir: string) {}

  save(file: AppStateFile) {
    if (!fs.existsSync(this.dir)) fs.mkdirSync(this.dir)
    const backupName = plusOne(`${file.version}_${file.name}`)
    const backupPath = this.join(backupName)
    fs.copyFileSync(file.path, backupPath)
  }

  join(name: string) {
    return path.join(this.dir, name)
  }
}
