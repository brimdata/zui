/* @flow */
import type {WindowName} from "../../tron/windowManager"
import type {WindowParams} from "../../tron/window"
import type {
  WindowsCloseMsg,
  WindowsDestroyMsg,
  WindowsInitialStateMsg,
  WindowsOpenMsg,
  WindowsNewSearchTabMsg
} from "../types"
import type {State} from "../../../state/types"
import type {SpanArgs} from "../../../state/Search/types"

export type NewTabSearchParams = {
  program: string,
  span: SpanArgs,
  spaceID: string,
  spaceName: string
}

export default {
  open(
    name: WindowName,
    params: $Shape<WindowParams>,
    state: State
  ): WindowsOpenMsg {
    return {
      channel: "windows:open",
      name,
      params,
      state
    }
  },
  close(): WindowsCloseMsg {
    return {
      channel: "windows:close"
    }
  },
  newSearchTab(params: Object): WindowsNewSearchTabMsg {
    return {
      channel: "windows:newSearchTab",
      params
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
