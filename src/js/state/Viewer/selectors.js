/* @flow */

import {createSelector} from "reselect"

import type {RecordData} from "../../types/records"
import type {State} from "../types"
import type {TabState} from "../Tab/types"
import type {ViewerState} from "./types"
import Log from "../../models/Log"
import Tabs from "../Tabs"
import brim from "../../brim"

const getViewer = createSelector<State, void, ViewerState, TabState>(
  Tabs.getActiveTab,
  (tab) => tab.viewer
)

const getViewerRecords = createSelector<State, void, *, ViewerState>(
  getViewer,
  (viewer) => viewer.records
)

export default {
  getViewer,
  getViewerRecords,

  isFetching: (state: TabState) => state.viewer.status === "FETCHING",

  getLogs: createSelector<State, void, Log[], RecordData[]>(
    getViewerRecords,
    (records) => records.map(brim.record).map(brim.interop.recordToLog)
  ),

  getStatus: createSelector<State, void, *, ViewerState>(
    getViewer,
    (viewer) => viewer.status
  ),

  getEndStatus: createSelector<State, void, *, ViewerState>(
    getViewer,
    (viewer) => viewer.endStatus
  ),

  getColumns: createSelector<State, void, *, ViewerState>(
    getViewer,
    (viewer) => viewer.columns
  ),

  getColumnHeadersView: createSelector<State, void, *, ViewerState>(
    getViewer,
    (viewer) => viewer.columnHeadersView
  ),

  getStats: createSelector<State, void, *, ViewerState>(
    getViewer,
    (viewer) => viewer.stats
  ),

  getScrollPos: createSelector<State, void, *, ViewerState>(
    getViewer,
    (viewer) => viewer.scrollPos
  )
}
