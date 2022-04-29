import {createSelector} from "reselect"
import {ScrollPosition} from "src/js/types"
import {SearchStatus} from "src/js/types/searches"
import {TypeDefs, zed} from "@brimdata/zealot"
import {TabState} from "../Tab/types"
import Tabs from "../Tabs"
import {State} from "../types"
import {createSelection, ViewerSelection} from "./helpers/selection"
import {ViewerSelectionData, ViewerState} from "./types"
import activeTabSelect from "../Tab/activeTabSelect"

export const getViewer = createSelector<State, TabState, ViewerState>(
  Tabs.getActiveTab,
  (tab) => tab.viewer
)

export const getViewerRecords = createSelector<
  State,
  ViewerState,
  zed.Record[]
>(getViewer, (viewer) => viewer.records)

export const getLogs = getViewerRecords
export const getRecords = getViewerRecords

export const getStatus = createSelector<State, ViewerState, SearchStatus>(
  getViewer,
  (viewer) => viewer.status
)

export const isFetching = createSelector<State, ViewerState, boolean>(
  getViewer,
  (viewer) => viewer.status === "FETCHING"
)

export const isComplete = createSelector<State, ViewerState, boolean>(
  getViewer,
  (viewer) => viewer.endStatus === "COMPLETE"
)

export const isLimited = createSelector<State, ViewerState, boolean>(
  getViewer,
  (viewer) => viewer.endStatus === "LIMIT"
)

export const getSearchKey = createSelector<State, ViewerState, string>(
  getViewer,
  (viewer) => viewer.searchKey
)

export const getEndStatus = createSelector<State, ViewerState, string>(
  getViewer,
  (viewer) => viewer.endStatus
)

export const getShapes = createSelector<State, ViewerState, TypeDefs>(
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

export const getError = activeTabSelect((t) => {
  return t.viewer.error
})
