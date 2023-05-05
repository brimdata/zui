import {app} from "electron"
import {appPathSetup} from "../appPathSetup"
import {handleSquirrelEvent} from "../squirrel"
import {windowsPre25Exists} from "../windows-pre-25"
import {MainArgs} from "./args"
import {setLogLevel} from "../set-log-level"
import {runMigrations} from "./run-migrations"

export async function beforeBoot(
  args: Partial<MainArgs>
): Promise<string | null> {
  // Disable security warnings
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"
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

  await runMigrations()

  return null
}
