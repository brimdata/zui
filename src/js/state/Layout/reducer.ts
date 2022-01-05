import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {ColumnHeadersViewState, InvestigationView, ResultsView} from "./types"

const slice = createSlice({
  name: "TAB_LAYOUT",
  initialState: {
    rightSidebarIsOpen: false,
    rightSidebarWidth: 260,
    investigationView: "linear" as InvestigationView,
    columnHeadersView: "AUTO" as ColumnHeadersViewState,
    resultsView: "TABLE" as ResultsView
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
    setHistoryView: (s, a: PayloadAction<InvestigationView>) => {
      // This belongs in the appearance (window level) state slice
      s.investigationView = a.payload
    },
    setColumnsView: (s, a: PayloadAction<ColumnHeadersViewState>) => {
      s.columnHeadersView = a.payload
    },
    setResultsView: (s, a: PayloadAction<ResultsView>) => {
      s.resultsView = a.payload
    }
  }
})

export const reducer = slice.reducer
export const actions = slice.actions
