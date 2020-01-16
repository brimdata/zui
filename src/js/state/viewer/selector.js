/* @flow */

import {createSelector} from "reselect"

import type {RecordData} from "../../types/records"
import type {State} from "../types"
import type {TabState} from "../Tab/types"
import type {ViewerState} from "./types"
import Log from "../../models/Log"
import brim from "../../brim"
import Tabs from "../Tabs"

const getViewer = createSelector<State, void, ViewerState, TabState>(
  Tabs.getActiveTab,
  (tab) => tab.viewer
)

export const getViewerRecords = createSelector<State, void, *, ViewerState>(
  getViewer,
  (viewer) => viewer.records
)

export const getViewerLogs = createSelector<State, void, Log[], RecordData[]>(
  getViewerRecords,
  (records) => records.map(brim.record).map(brim.interop.recordToLog)
)

export const getViewerStatus = createSelector<State, void, *, ViewerState>(
  getViewer,
  (viewer) => viewer.status
)

export const getViewerEndStatus = createSelector<State, void, *, ViewerState>(
  getViewer,
  (viewer) => viewer.endStatus
)

export const getViewerColumns = createSelector<State, void, *, ViewerState>(
  getViewer,
  (viewer) => viewer.columns
)

export const getViewerStats = createSelector<State, void, *, ViewerState>(
  getViewer,
  (viewer) => viewer.stats
)
