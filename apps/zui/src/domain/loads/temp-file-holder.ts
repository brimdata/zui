import os from "os"
import path from "path"
import * as fs from "fs-extra"
import {getUniqName} from "src/util/get-uniq-name"

export class TempFileHolder {
  files: string[] = []
  dir: string

  constructor(namespace: string) {
    this.dir = path.join(os.tmpdir(), namespace)
    fs.ensureDirSync(this.dir)
  }

  createFile(prefix: string, data: string) {
    const file = this.nextFile(prefix)
    fs.writeFileSync(file, data)
    this.files.push(file)
    return file
  }

  removeFile(filePath: string) {
    fs.removeSync(filePath)
    this.files = this.files.filter((f) => f !== filePath)
  }

  has(filePath: string) {
    return this.files.find((f) => f === filePath)
  }

  destroy() {
    fs.removeSync(this.dir)
  }

  private nextFile(prefix: string) {
    console.log(prefix, this.fileNames)
    return path.join(this.dir, getUniqName(prefix, this.fileNames))
  }

  private get fileNames() {
    return this.files.map((f) => path.basename(f))
  }
}
