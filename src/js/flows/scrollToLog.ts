import {isEqual} from "lodash"
import {zed} from "@brimdata/zealot"
import {Thunk} from "../state/types"
import Viewer from "../state/Viewer"
import Results from "../state/Results"
import {MAIN_RESULTS} from "../state/Results/types"

export default (log: zed.Record): Thunk =>
  (dispatch, getState) => {
    const state = getState()
    const logs = Results.getValues(MAIN_RESULTS)(state)
    const index = logs.findIndex((log2) => isEqual(log2, log))
    const rowHeight = 25 // pixels
    const scrollPos = {x: 0, y: index * rowHeight}
    dispatch(Viewer.setScroll(scrollPos))
  }
