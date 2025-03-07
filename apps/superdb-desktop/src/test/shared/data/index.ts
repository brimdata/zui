import fs from "fs-extra"
import path from "path"
import {File} from "web-file-polyfill"

class Data {
  getPath(name) {
    return path.join(__dirname, name)
  }

  getWebFile(name) {
    const path = this.getPath(name)
    const buffer = fs.readFileSync(path)
    const f = new File([buffer as BlobPart], name)
    // @ts-ignore
    f.path = path
    return f
  }
}

export default new Data()
