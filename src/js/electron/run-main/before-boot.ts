import {app} from "electron"
import {appPathSetup} from "../appPathSetup"
import {isFirstRun} from "../first-run"
import isDev from "../isDev"
import migrateBrimToZui from "../migrateBrimToZui"
import {handleSquirrelEvent} from "../squirrel"
import {windowsPre25Exists} from "../windows-pre-25"
import {MainArgs} from "./args"
import {setLogLevel} from "../set-log-level"

export async function beforeBoot(
  args: Partial<MainArgs>
): Promise<string | null> {
  // Setup app paths, this must be first
  appPathSetup()
  setLogLevel()
  // Disable for certain platforms
  app.disableHardwareAcceleration()
  // Ensure only one instance of the app is ever on (windows)
  const lock = app.requestSingleInstanceLock()
  if (args.singleInstance && !lock) {
    app.quit()
    return "Instance of the app already running"
  }

  if (handleSquirrelEvent(app)) {
    return "Squirrel event"
  }

  if (await windowsPre25Exists()) {
    app.quit()
    return "Windows Version Pre 25 Exists"
  }

  // On first ever run of a ZUI release, check if there is existing Brim app
  // data and if so, copy it into ZUI.
  if (!isDev && (await isFirstRun())) migrateBrimToZui()

  return null
}
