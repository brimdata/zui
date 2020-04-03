/* @flow */
import type {Thunk} from "../state/types"
import Log from "../models/Log"
import LogDetails from "../state/LogDetails"
import Viewer from "../state/Viewer"
import {viewLogDetail} from "./viewLogDetail"

export const adjustSelectedLogIndex = (indexDelta: number): Thunk => (
  dispatch,
  getState
) => {
  const state = getState()

  const currentLog = LogDetails.build(state)
  if (!currentLog) return null

  const viewerLogs = Viewer.getLogs(state)
  const currentLogNdx = viewerLogs.findIndex((viewerLog) =>
    Log.isSame(viewerLog, currentLog)
  )
  if (currentLogNdx === -1) return null

  const newNdx = currentLogNdx + indexDelta
  if (newNdx < 0 || newNdx > viewerLogs.length - 1) return null

  dispatch(viewLogDetail(viewerLogs[newNdx]))
}
