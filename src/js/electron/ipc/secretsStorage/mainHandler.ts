import {ipcMain} from "electron"
import keytar from "keytar"
import * as os from "os"

export default function() {
  ipcMain.handle("secretStorage:setKey", async (e, {key, val}) => {
    return keytar.setPassword(key, os.userInfo().username, val)
  })
  ipcMain.handle("secretStorage:getKey", async (e, {key}) => {
    return keytar.getPassword(key, os.userInfo().username)
  })
  ipcMain.handle("secretStorage:deleteKey", async (e, {key}) => {
    return keytar.deletePassword(key, os.userInfo().username)
  })
}
