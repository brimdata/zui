/* @flow */

import fs from "fs"
import stream from "stream"

function toNodeReadable(reader) {
  return new stream.Readable({
    // #$FlowFixMe
    read: async function() {
      const {done, value} = await reader.read()
      this.push(done ? null : value)
    }
  })
}

export function saveToFile({body}: Response, file: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (body) {
      const webReadable = body.getReader()
      const data = toNodeReadable(webReadable).on("error", reject)
      const fileStream = fs
        .createWriteStream(file)
        .on("error", reject)
        .on("close", () => resolve(file))
      data.pipe(fileStream)
    } else {
      reject(new Error("No Response Body"))
    }
  })
}
