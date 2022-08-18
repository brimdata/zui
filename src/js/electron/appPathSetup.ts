import {app} from "electron"
import log from "electron-log"
import electronIsDev from "./isDev"
import path from "path"

// setupPaths must be called very early in startup, before the app 'ready'
// event fires, to ensure any Electron state is recorded to the intended
// locations.
export function appPathSetup() {
  if (electronIsDev) {
    // isDev is true for general dev execution and integration tests.
    // The only known instance of isDev being true and --user-data-dir
    // being set is under Playwright.
    // We don't override for integration tests as they set userData
    // via the user-data-dir chromeDriver command line argument,
    // so don't override it.
    if (!app.commandLine.hasSwitch("user-data-dir")) {
      // For general developer execution, put state and logs under a
      // "run" directory in the git directory.
      app.setPath("userData", path.join(app.getAppPath(), "run"))
    } else {
      app.setPath("userData", app.commandLine.getSwitchValue("user-data-dir"))
    }
  }
  // Logs go under userData, to make finding logs consistent across platforms.
  app.setPath("logs", path.join(app.getPath("userData"), "logs"))

  log.transports.file.resolvePath = (variables) => {
    return path.join(app.getPath("logs"), variables.fileName)
  }
}
