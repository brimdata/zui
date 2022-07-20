import {createSelector} from "reselect"
import {ScrollPosition} from "src/js/types"
import {TypeDefs, zed} from "@brimdata/zealot"
import {TabState} from "../Tab/types"
import Tabs from "../Tabs"
import {State} from "../types"
import {createSelection, ViewerSelection} from "./helpers/selection"
import {ViewerSelectionData, ViewerState} from "./types"
import {getValues} from "../Results/selectors"
import {MAIN_RESULTS} from "../Results/types"

export const getViewer = createSelector<State, TabState, ViewerState>(
  Tabs.getActiveTab,
  (tab) => tab.viewer
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
  zed.Value[],
  zed.Value[]
>(getSelection, getValues(MAIN_RESULTS), (selection, records) =>
  selection.getIndices().map((index) => records[index])
)
