/* @flow */

import {app} from "electron"
import log from "electron-log"
import electronIsDev from "./isDev"
import path from "path"

// setupPaths must be called very early in startup, before the app 'ready'
// event fires, to ensure any Electron state is recorded to the intended
// locations.
function appPathSetup() {
  if (electronIsDev) {
    // isDev is true for general dev execution and integration tests.
    if (process.env.BRIM_ITEST != "true") {
      // For general developer execution, put state and logs under a
      // "run" directory in the git directory.
      app.setPath("userData", path.join(app.getAppPath(), "run"))
    }
    // We don't override for integration tests as they set userData
    // via the user-data-dir chromeDriver command line argument,
    // so don't override it.
  }
  // We don't have cross-user state sharing, so use userData for appData.
  app.setPath("appData", path.join(app.getPath("userData"), "appData"))
  // Logs go under userData, to make finding logs consisten across platforms.
  app.setPath("logs", path.join(app.getPath("userData"), "logs"))

  log.transports.file.resolvePath = (variables) => {
    return path.join(app.getPath("logs"), variables.fileName)
  }

  log.info(
    "app paths: getAppPath",
    app.getAppPath(),
    "appData",
    app.getPath("appData"),
    "userData",
    app.getPath("userData"),
    "logs",
    app.getPath("logs")
  )
}

module.exports = {appPathSetup}
