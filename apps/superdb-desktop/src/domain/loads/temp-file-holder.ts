import path from "path"
import * as fs from "fs-extra"
import {getUniqName} from "src/util/get-uniq-name"

export class TempFileHolder {
  dir: string

  constructor(namespace: string) {
    this.dir = fs.mkdtempSync(namespace)
  }

  createFile(prefix: string, data: string) {
    const file = this.nextFile(prefix)
    fs.writeFileSync(file, data)
    return file
  }

  removeFile(filePath: string) {
    fs.removeSync(filePath)
  }

  has(filePath: string) {
    const dir = path.dirname(filePath)
    const name = path.basename(filePath)
    return this.dir === dir && this.fileNames.includes(name)
  }

  destroy() {
    fs.removeSync(this.dir)
  }

  private nextFile(prefix: string) {
    return path.join(this.dir, getUniqName(prefix, this.fileNames))
  }

  private get fileNames() {
    return fs.readdirSync(this.dir)
  }
}
