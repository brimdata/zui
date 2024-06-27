import {app, net} from "electron"
import path from "node:path"
import {pathToFileURL} from "node:url"

export class AssetServer {
  fromNodeModules(relativePath: string) {
    const file = require.resolve(relativePath)
    const url = pathToFileURL(file).toString()
    return net.fetch(url, {bypassCustomProtocolHandlers: true})
  }

  fromPublic(relativeUrl: string) {
    const file = path.join(app.getAppPath(), "out", relativeUrl)
    const url = pathToFileURL(file).toString()
    return net.fetch(url, {bypassCustomProtocolHandlers: true})
  }
}
