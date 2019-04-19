/* @flow */
import type {State} from "../reducers/types"

export function getViewerLogs(state: State) {
  return state.viewer.logs
}

export function getViewerStatus(state: State) {
  return state.viewer.status
}

export function getViewerColumns(state: State) {
  return state.viewer.columns
}
