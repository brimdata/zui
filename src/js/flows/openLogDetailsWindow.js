/* @flow */

import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import type {Thunk} from "redux-thunk"

export const openLogDetailsWindow = (): Thunk => (dispatch, getState) => {
  invoke(ipc.windows.open("detail", {size: [700, 600]}, getState()))
}
