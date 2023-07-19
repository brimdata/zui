import log from "electron-log"
import {app} from "electron"

export function initialize() {
  app.on("web-contents-created", (event, contents) => {
    contents.on("will-attach-webview", (e) => {
      e.preventDefault()
      log.error("Security Warning: Prevented creation of webview")
    })

    contents.on("will-navigate", (e, url) => {
      if (contents.getURL() === url) return // Allow reloads
      e.preventDefault()
      log.error(`Security Warning: Prevented navigation to ${url}`)
    })

    contents.setWindowOpenHandler((_details) => {
      log.error("Security Warning: Prevented new window from renderer")
      return {action: "deny"}
    })
  })
}
