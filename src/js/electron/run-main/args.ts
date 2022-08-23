import {app} from "electron"
import isDev from "../isDev"
import {join} from "path"
import pkg from "../pkg"

export const mainDefaults = () => ({
  lakePort: pkg.lake.port || 9867,
  lakeRoot: join(app.getPath("userData"), "lake"),
  lakeLogs: app.getPath("logs"),
  lake: true,
  devtools: isDev,
  appState: join(app.getPath("userData"), "appState.json"),
  releaseNotes: true,
  autoUpdater: true,
  singleInstance: true,
})

export type MainArgs = ReturnType<typeof mainDefaults>
