/* @flow */
import type {WindowName} from "../../tron/windowManager"
import type {WindowParams} from "../../tron/window"
import type {
  WindowsCloseMsg,
  WindowsRedirectMsg,
  WindowsInitialStateMsg
} from "../types"

export default {
  redirect(name: WindowName, params: $Shape<WindowParams>): WindowsRedirectMsg {
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
  },
  initialState(id: string): WindowsInitialStateMsg {
    return {
      channel: "windows:initialState",
      id
    }
  }
}
