import log from "electron-log"

import {ipcMain, Menu} from "electron"

global.process.on("spectron:mock", (name, value) => {
  log.info("Spectron is mocking", name, "with:", value)
  ipcMain.removeHandler(name)
  ipcMain.handle(name, () => value)
})

global.process.on("spectron:clickAppMenuItem", (id) => {
  log.info("Specton is clicking app menu item id: ", id)
  const menu = Menu.getApplicationMenu()
  const item = menu.getMenuItemById(id)
  item.click()
})
