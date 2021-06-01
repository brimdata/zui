import path from "path"
import fs from "fs-extra"
class Data {
  getPath(name) {
    return path.join(__dirname, name)
  }

  getDOMFile(name) {
    const path = this.getPath(name)
    const buffer = fs.readFileSync(path)
    const f = new File([buffer as BlobPart], name)
    f.path = path
    return f
  }
}

export default new Data()
