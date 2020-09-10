import {createSelector} from "reselect"

import {RecordData} from "../../types/records"
import {State} from "../types"
import {TabState} from "../Tab/types"
import {ViewerSelection, createSelection} from "./helpers/selection"
import {
  ViewerSelectionData,
  ViewerState,
  ViewerStatus,
  ViewerColumns
} from "./types"
import Log from "../../models/Log"
import Tabs from "../Tabs"
import brim from "../../brim"
import {ScrollPosition} from "src/js/types"
import {SearchStatus} from "src/js/types/searches"

export const getViewer = createSelector<State, TabState, ViewerState>(
  Tabs.getActiveTab,
  (tab) => tab.viewer
)

export const getViewerRecords = createSelector<
  State,
  ViewerState,
  RecordData[]
>(getViewer, (viewer) => viewer.records)

export const isFetching = (state: TabState) =>
  state.viewer.status === "FETCHING"

export const getLogs = createSelector<State, RecordData[], Log[]>(
  getViewerRecords,
  (records) => records.map(brim.record).map(brim.interop.recordToLog)
)

export const getStatus = createSelector<State, ViewerState, SearchStatus>(
  getViewer,
  (viewer) => viewer.status
)

export const getEndStatus = createSelector<State, ViewerState, string>(
  getViewer,
  (viewer) => viewer.endStatus
)

export const getColumns = createSelector<State, ViewerState, ViewerColumns>(
  getViewer,
  (viewer) => viewer.columns
)

export const getScrollPos = createSelector<State, ViewerState, ScrollPosition>(
  getViewer,
  (viewer) => viewer.scrollPos
)

export const getSelectionData = createSelector<
  State,
  ViewerState,
  ViewerSelectionData
>(getViewer, (viewer) => viewer.selection)

export const getSelection = createSelector<
  State,
  ViewerSelectionData,
  ViewerSelection
>(getSelectionData, (data) => createSelection(data))

export const getSelectedRecords = createSelector<
  State,
  ViewerSelection,
  RecordData[],
  RecordData[]
>(getSelection, getViewerRecords, (selection, records) =>
  selection.getIndices().map((index) => records[index])
)
