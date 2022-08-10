import {meta} from "src/app/ipc/meta"
import {paths} from "src/app/ipc/paths"
import {BrimMain} from "../brim"
import globalStoreMainHandler from "../ipc/globalStore/mainHandler"
import windowsMainHandler from "../ipc/windows/mainHandler"
import secretsMainHandler from "../ipc/secrets/mainHandler"
import {serve} from "src/pkg/electron-ipc-service"
import {app, ipcMain} from "electron"

export function initialize(main: BrimMain) {
  windowsMainHandler(main)
  globalStoreMainHandler(main)
  secretsMainHandler()
  serve(paths)
  serve(meta)

  ipcMain.handle("get-feature-flags", () => {
    return app.commandLine.getSwitchValue("feature-flags").split(",")
  })

  ipcMain.handle("get-main-args", () => ({
    ...main.args,
  }))
}
