/* @flow */
import log from "electron-log"

import {ipcMain} from "electron"

global.process.on("spectron:mock", (name, value) => {
  log.info("Spectron is mocking", name, "with:", value)
  ipcMain.removeHandler(name)
  ipcMain.handle(name, () => value)
})
