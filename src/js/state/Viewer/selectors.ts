import {createSelector} from "reselect"
import {ScrollPosition} from "src/js/types"
import {SearchStatus} from "src/js/types/searches"
import {zed} from "zealot"
import {TabState} from "../Tab/types"
import Tabs from "../Tabs"
import {State} from "../types"
import {createSelection, ViewerSelection} from "./helpers/selection"
import {SchemaMap, ViewerSelectionData, ViewerState} from "./types"

export const getViewer = createSelector<State, TabState, ViewerState>(
  Tabs.getActiveTab,
  (tab) => tab.viewer
)

export const getViewerRecords = createSelector<
  State,
  ViewerState,
  zed.Record[]
>(getViewer, (viewer) => viewer.records)

export const isFetching = (state: TabState) =>
  state.viewer.status === "FETCHING"

export const getLogs = getViewerRecords
export const getRecords = getViewerRecords

export const getStatus = createSelector<State, ViewerState, SearchStatus>(
  getViewer,
  (viewer) => viewer.status
)

export const getEndStatus = createSelector<State, ViewerState, string>(
  getViewer,
  (viewer) => viewer.endStatus
)

export const getColumns = createSelector<State, ViewerState, SchemaMap>(
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
  zed.Record[],
  zed.Record[]
>(getSelection, getRecords, (selection, records) =>
  selection.getIndices().map((index) => records[index])
)
