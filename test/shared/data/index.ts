import path from "path"
import fs from "fs-extra"
import {ReadableStream} from "web-streams-polyfill/ponyfill"
class Data {
  getPath(name) {
    return path.join(__dirname, name)
  }

  getDOMFile(name) {
    const path = this.getPath(name)
    const buffer = fs.readFileSync(path)
    const f = new File([buffer as BlobPart], name)
    f.stream = () => bufferToReadableStream(buffer)
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
