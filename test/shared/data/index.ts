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

const bufferToReadableStream = (buffer: Buffer) => {
  return new ReadableStream({
    start(controller) {
      return pump()
      function pump() {
        controller.enqueue(buffer)
        controller.close()
      }
    }
  })
}

export default new Data()
