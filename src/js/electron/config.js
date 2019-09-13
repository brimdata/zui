/* @flow */
import {app} from "electron"
import path from "path"

export default {
  windowStateFile: path.join(app.getPath("userData"), "windowState.json")
}
