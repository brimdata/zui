import {SpanArgs} from "../../../state/Search/types"
import {State} from "../../../state/types"
import {WindowName} from "../../tron/windowManager"
import {WindowParams} from "../../tron/window"
import {
  WindowsInitialStateMsg,
  WindowsOpenMsg,
  WindowsNewSearchTabMsg,
  WindowsOpenDirectorySelect,
  WindowsAuthCallbackMsg,
  WindowsSetKeyStorageMsg,
  WindowsGetKeyStorageMsg,
  WindowsDeleteKeyStorageMsg
} from "../types"

export type NewTabSearchParams = {
  host: string
  port: string
  workspaceId: string
  program: string
  span: SpanArgs
  spaceId: string
  isNewWin?: boolean
}

export default {
  open(
    name: WindowName,
    params: Partial<WindowParams>,
    state: State
  ): WindowsOpenMsg {
    return {
      channel: "windows:open",
      name,
      params,
      state
    }
  },
  newSearchTab(params: NewTabSearchParams): WindowsNewSearchTabMsg {
    return {
      channel: "windows:newSearchTab",
      params
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
  },
  authCallback(workspaceId: string, code: string): WindowsAuthCallbackMsg {
    return {
      channel: "windows:authCallback",
      workspaceId,
      code
    }
  },
  setKeyStorage(key: string, val: string): WindowsSetKeyStorageMsg {
    return {
      channel: "windows:setKeyStorage",
      key,
      val
    }
  },
  getKeyStorage(key: string): WindowsGetKeyStorageMsg {
    return {
      channel: "windows:getKeyStorage",
      key
    }
  },
  deleteKeyStorage(key: string): WindowsDeleteKeyStorageMsg {
    return {
      channel: "windows:deleteKeyStorage",
      key
    }
  }
}
