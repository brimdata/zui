import {app, protocol} from "electron"
import path from "path"

export function runProtocolHandlers() {
  app.whenReady().then(() => {
    protocol.interceptFileProtocol("file", (request, callback) => {
      const rootPath = path.join(__dirname, "..", "out")
      const relPath = request.url.slice("file://".length).split("?")[0]
      const absPath = path.join(rootPath, relPath)
      callback(absPath)
    })
  })
}
