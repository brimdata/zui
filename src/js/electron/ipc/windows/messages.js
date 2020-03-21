/* @flow */
import type {WindowName} from "../../tron/windowManager"
import type {WindowParams} from "../../tron/window"
import type {
  WindowsCloseMsg,
  WindowsDestroyMsg,
  WindowsInitialStateMsg,
  WindowsRedirectMsg
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
  destroy(): WindowsDestroyMsg {
    return {
      channel: "windows:destroy"
    }
  },
  initialState(id: string): WindowsInitialStateMsg {
    return {
      channel: "windows:initialState",
      id
    }
  }
}
