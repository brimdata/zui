/* @flow */
import type {$WindowManager} from "../tron/windowManager"
import windowsMainHandler from "./windows/mainHandler"
import zqdMainHandler from "./zqd/mainHandler"

export default function(manager: $WindowManager) {
  windowsMainHandler(manager)
  zqdMainHandler()
}
