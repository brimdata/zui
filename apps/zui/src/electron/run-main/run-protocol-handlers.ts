import {app, protocol, net} from "electron"
import path from "path"
import {pathToFileURL} from "url"

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app-asset",
    privileges: {standard: true, supportFetchAPI: true, bypassCSP: true},
  },
])

export function runProtocolHandlers() {
  app.whenReady().then(() => {
    protocol.interceptFileProtocol("file", (request, callback) => {
      const url = new URL(request.url)
      const rootPath = path.join(__dirname, "..", "out")
      const relPath = url.pathname
      const absPath = path.join(rootPath, relPath)
      callback(absPath)
    })

    protocol.handle("app-asset", (request) => {
      const {host, pathname, href} = new URL(request.url)
      if (host === "node_modules") {
        const path = pathname.slice(1)
        const file = require.resolve(path)
        const url = pathToFileURL(file).toString()
        return net.fetch(url, {bypassCustomProtocolHandlers: true})
      }
      throw new Error("Unknown App Asset " + href)
    })
  })
}
