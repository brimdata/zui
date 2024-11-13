import path from "path"
import fs from "fs"
import {AppStateFile} from "./app-state-file"
import {plusOne} from "src/util/plus-one"

export class AppStateBackup {
  constructor(public dir: string) {
    if (!fs.existsSync(this.dir)) fs.mkdirSync(this.dir)
  }

  save(file: AppStateFile) {
    const backupPath = this.getPath(file.version)
    fs.copyFileSync(file.path, backupPath)
  }

  join(name: string) {
    return path.join(this.dir, name)
  }

  getPath(version: number) {
    const existing = fs.readdirSync(this.dir)
    let i = 1
    let name = ""
    do {
      name = this.getName(version, i++)
    } while (existing.includes(name))

    return this.join(name)
  }

  getName(version: number, n: number) {
    if (n > 1) return `${version}_backup_${n}.json`
    else return `${version}_backup.json`
  }
}
