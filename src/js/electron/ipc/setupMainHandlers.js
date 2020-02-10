/* @flow */
import type {$WindowManager} from "../tron"
import windowsMainHandler from "./windows/mainHandler"
import zqdMainHandler from "./zqd/mainHandler"

export default function(manager: $WindowManager) {
  windowsMainHandler(manager)
  zqdMainHandler()
}
