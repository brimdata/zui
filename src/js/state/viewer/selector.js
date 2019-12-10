/* @flow */

import {createSelector} from "reselect"

import type {RecordData} from "../../types/records"
import type {State} from "../types"
import Log from "../../models/Log"
import brim from "../../brim"

export function getViewerRecords(state: State) {
  return state.viewer.records
}

export const getViewerLogs = createSelector<State, void, Log[], RecordData[]>(
  getViewerRecords,
  (records) => records.map(brim.record).map(brim.interop.recordToLog)
)

export function getViewerStatus(state: State) {
  return state.viewer.status
}

export function getViewerColumns(state: State) {
  return state.viewer.columns
}
