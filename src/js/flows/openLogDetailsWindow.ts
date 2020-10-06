import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import {mustGetConnection} from "../state/Current/selectors"
import {Thunk} from "../state/types"
import produce from "immer"

export const openLogDetailsWindow = (): Thunk => (dispatch, getState) => {
  const {host, port} = mustGetConnection(getState())
  const state = produce(getState(), (draft) => {
    for (let tab of draft.tabs.data) {
      delete tab.columns
      delete tab.viewer
    }
  })
  invoke(
    ipc.windows.open("detail", {size: [700, 600], query: {host, port}}, state)
  )
}
