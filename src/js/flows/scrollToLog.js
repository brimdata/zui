/* @flow */

import type {Thunk} from "../state/types"
import Viewer from "../state/Viewer"
import Log from "../models/Log"

export default (log: Log): Thunk => (dispatch, getState) => {
  const state = getState()
  const logs = Viewer.getLogs(state)
  const index = logs.findIndex((log2) => Log.isSame(log2, log))
  const rowHeight = 25 // pixels
  const scrollPos = {x: 0, y: index * rowHeight}
  dispatch(Viewer.setScroll(scrollPos))
}
