import {
  WindowsInitialStateMsg,
  WindowsNewSearchTabMsg,
  WindowsOpenDirectorySelect,
} from "../types"
export type NewTabSearchParams = {
  href: string
  isNewWin?: boolean
}

export default {
  newSearchTab(params: NewTabSearchParams): WindowsNewSearchTabMsg {
    return {
      channel: "windows:newSearchTab",
      params,
    }
  },
  initialState(id: string): WindowsInitialStateMsg {
    return {
      channel: "windows:initialState",
      id,
    }
  },
  openDirectorySelect(): WindowsOpenDirectorySelect {
    return {
      channel: "windows:openDirectorySelect",
    }
  },
}
