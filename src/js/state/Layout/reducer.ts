import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {ColumnHeadersViewState, ResultsView, PaneName} from "./types"

const slice = createSlice({
  name: "TAB_LAYOUT",
  initialState: {
    rightSidebarIsOpen: true,
    rightSidebarWidth: 260,
    columnHeadersView: "AUTO" as ColumnHeadersViewState,
    resultsView: "TABLE" as ResultsView,
    currentPaneName: "versions" as PaneName,
    isEditingTitle: false,
    titleFormAction: "create" as "create" | "update",
  },
  reducers: {
    showDetailPane: (s) => {
      s.rightSidebarIsOpen = true
    },
    hideDetailPane: (s) => {
      s.rightSidebarIsOpen = false
    },
    toggleDetailPane: (s) => {
      s.rightSidebarIsOpen = !s.rightSidebarIsOpen
    },
    setDetailPaneWidth: (s, a: PayloadAction<number>) => {
      s.rightSidebarWidth = a.payload
    },
    setColumnsView: (s, a: PayloadAction<ColumnHeadersViewState>) => {
      s.columnHeadersView = a.payload
    },
    setResultsView: (s, a: PayloadAction<ResultsView>) => {
      s.resultsView = a.payload
    },
    setCurrentPaneName(s, action: PayloadAction<PaneName>) {
      s.currentPaneName = action.payload
    },
    showTitleForm: {
      prepare: (action: "create" | "update") => ({payload: {action}}),
      reducer: (s, a: PayloadAction<{action: "create" | "update"}>) => {
        s.isEditingTitle = true
        s.titleFormAction = a.payload.action
      },
    },
    hideTitleForm(s) {
      s.isEditingTitle = false
      s.titleFormAction = "create"
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
