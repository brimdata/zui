import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {ColumnHeadersViewState, ResultsView, PaneName} from "./types"

// This is tab level ui persistence
const slice = createSlice({
  name: "TAB_LAYOUT",
  initialState: {
    columnHeadersView: "AUTO" as ColumnHeadersViewState,
    resultsView: "TABLE" as ResultsView,
    currentPaneName: "history" as PaneName,
    isEditingTitle: false,
    titleFormAction: "create" as "create" | "update",
    showHistogram: true,
    editorHeight: 100,
    chartHeight: 100,
  },
  reducers: {
    setChartHeight(s, a: PayloadAction<number>) {
      s.chartHeight = Math.max(a.payload, 80)
    },
    setEditorHeight(s, a: PayloadAction<number>) {
      s.editorHeight = Math.max(a.payload, 40)
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
    showTitleForm(s) {
      s.isEditingTitle = true
    },
    hideTitleForm(s) {
      s.isEditingTitle = false
    },
    toggleHistogram(s) {
      s.showHistogram = !s.showHistogram
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
