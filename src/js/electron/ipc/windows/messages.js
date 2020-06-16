/* @flow */
import type {SpanArgs} from "../../../state/Search/types"
import type {State} from "../../../state/types"
import type {WindowName} from "../../tron/windowManager"
import type {WindowParams} from "../../tron/window"
import type {
  WindowsCloseMsg,
  WindowsDestroyMsg,
  WindowsInitialStateMsg,
  WindowsOpenMsg,
  WindowsNewSearchTabMsg,
  WindowsOpenDirectorySelect
} from "../types"

export type NewTabSearchParams = {
  program: string,
  span: SpanArgs,
  spaceId: string,
  isNewWin?: boolean
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
  newSearchTab(params: NewTabSearchParams): WindowsNewSearchTabMsg {
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
  },
  openDirectorySelect(): WindowsOpenDirectorySelect {
    return {
      channel: "windows:openDirectorySelect"
    }
  }
}
