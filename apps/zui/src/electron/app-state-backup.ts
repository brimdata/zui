import path from "path"
import fs from "fs"
import {AppStateFile} from "./app-state-file"

export class AppStateBackup {
  constructor(public dir: string) {}

  save(file: AppStateFile) {
    const backupName = `${file.version}_${file.name}`
    const backupPath = this.join(backupName)
    fs.copyFileSync(file.path, backupPath)
  }

  join(name: string) {
    return path.join(this.dir, name)
  }
}
