import {app, protocol} from "electron"
import {AssetUrl} from "../protocols/asset-url"
import {AssetServer} from "../protocols/asset-server"

protocol.registerSchemesAsPrivileged([
  {
    scheme: "app-asset",
    privileges: {standard: true, supportFetchAPI: true, bypassCSP: true},
  },
])

export function runProtocolHandlers() {
  const server = new AssetServer()

  app.whenReady().then(() => {
    protocol.handle("app-asset", (request) => {
      const asset = new AssetUrl(request.url)

      if (asset.isNodeModule) {
        return server.fromNodeModules(asset.relativeUrl)
      } else {
        return server.fromPublic(asset.relativeUrl)
      }
    })
  })
}
