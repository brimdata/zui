/* @flow */
import type {$WindowManager} from "../tron/windowManager"
import mainStoreMainHandler from "./mainStore/mainHandler"
import windowsMainHandler from "./windows/mainHandler"
import zqdMainHandler from "./zqd/mainHandler"

export default function(manager: $WindowManager) {
  windowsMainHandler(manager)
  zqdMainHandler()
  mainStoreMainHandler()
}
