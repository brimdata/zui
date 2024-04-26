import {ipcMain} from "electron"
import {camelCase, capitalize} from "lodash"
import {BulletApplication} from "./application"

class MainIpc {
  listen() {
    console.log("Listening")
    ipcMain.handle("bullet:view-request", (e, controllerAction, params) => {
      const [shortName, action] = controllerAction.split("#")
      const name = capitalize(camelCase(shortName)) + "Controller"
      const Controller = BulletApplication.controllers[name]
      if (!Controller) {
        throw new Error("ControllerNotFound: " + controllerAction)
      }
      const instance = new Controller()
      return instance[action](params)
    })
  }
}

export const ipc = new MainIpc()
