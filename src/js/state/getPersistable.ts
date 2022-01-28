import produce from "immer"
import {State} from "./types"
import {GlobalState} from "./globalReducer"

export function getGlobalPersistable(state: GlobalState) {
  return produce(state, (draft: GlobalState) => {
    for (const ws of Object.values(draft.workspaces)) {
      if (ws.authType === "auth0" && ws.authData) {
        // accessToken only persists in native os keychain
        delete ws.authData.accessToken
      }
    }

    delete draft.configs
    delete draft.pools
  })
}

export function getWindowPersistable(state: State) {
  return produce(state, (draft: State) => {
    delete draft.errors
    delete draft.notice
    delete draft.handlers
    delete draft.systemTest
    delete draft.workspaceStatuses
    delete draft.toolbars
    delete draft.configs
    delete draft.modal
    delete draft.remoteQueries
    delete draft.pools

    for (const tab of draft.tabs.data) {
      delete tab.viewer
      delete tab.chart
      delete tab.logDetails
      delete tab.inspector
    }

    for (const ws of Object.values(draft.workspaces)) {
      if (ws.authType === "auth0" && ws.authData) {
        // accessToken only persists in native os keychain
        delete ws.authData.accessToken
      }
    }
  })
}
