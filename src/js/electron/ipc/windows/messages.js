/* @flow */
import type {WindowName} from "../../tron/windowManager"
import type {WindowParams} from "../../tron/window"
import type {WindowsCloseMsg, WindowsRedirectMsg} from "../types"

export default {
  redirect(name: WindowName, params: WindowParams): WindowsRedirectMsg {
    return {
      channel: "windows:redirect",
      name,
      params
    }
  },
  close(): WindowsCloseMsg {
    return {
      channel: "windows:close"
    }
  }
}
