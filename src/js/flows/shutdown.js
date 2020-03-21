/* @flow */
import {ipcRenderer} from "electron"

import type {Thunk} from "../state/types"
import Handlers from "../state/Handlers"
import Tab from "../state/Tab"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

export const shutdown = (): Thunk => (dispatch, getState) => {
  let client = Tab.getZealot(getState())
  let spaces = Handlers.getIngestSpaceNames(getState())
  deletePartialSpaces(spaces, client)
  persist(getState())
  invoke(ipc.windows.destroy())
}

function deletePartialSpaces(spaces, client) {
  spaces.forEach((spaceName) => {
    if (spaceName) client.spaces.delete(spaceName)
  })
}

function persist(state) {
  // remove state pieces which we are not interested in persisting
  delete state.errors
  delete state.notice
  delete state.handlers
  ipcRenderer.invoke("windows:saveState", global.windowId, global.getState())
}
