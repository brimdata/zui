import {
  createSlice,
  PayloadAction as Payload,
  PayloadAction,
} from "@reduxjs/toolkit"
import * as zed from "@brimdata/zed-js"
import {TableSettingsState} from "./types"
import {ColumnSizingInfoState} from "@tanstack/react-table"
import {actions as results} from "../Results/reducer"
import {RESULTS_QUERY} from "src/views/results-pane/config"

const table = createSlice({
  name: "TAB_TABLE",
  initialState: {
    settings: new Map<zed.Type, TableSettingsState>(),
    scrollPosition: {top: 0, left: 0},
    shape: null as zed.Type | null,
    columnExpandedDefault: false,
    columnResizeInfo: {} as ColumnSizingInfoState,
  },
  reducers: {
    setScrollPosition(state, action: Payload<{top: number; left: number}>) {
      state.scrollPosition = action.payload
    },
    setShape(state, action: Payload<zed.Type>) {
      state.shape = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(results.setShapes, (state, action) => {
      if (action.payload.id == RESULTS_QUERY) {
        const shapes = Object.values(action.payload.shapes)
        state.shape =
          shapes.length === 1 ? (zed.typeunder(shapes[0]) as zed.Type) : null
      }
    })
    builder.addMatcher(
      (action) => action.type.startsWith(settings.name),
      (state, action) => {
        const shape = state.shape
        const prev = state.settings.get(shape)
        const next = settingsReducer(prev, action)
        state.settings.set(shape, next)
      }
    )
  },
})

const settings = createSlice({
  name: "TAB_TABLE_SETTINGS",
  initialState: {
    valueExpanded: {},
    valuePage: {},
    columnWidth: {},
    columnExpanded: {},
    columnVisible: {},
    columnSorted: {},
  },
  reducers: {
    setValueExpanded(state, action: PayloadAction<Record<string, boolean>>) {
      state.valueExpanded = action.payload
    },
    setValuePage(state, action: PayloadAction<Record<string, number>>) {
      state.valuePage = action.payload
    },
    setColumnWidth(state, action: PayloadAction<Record<string, number>>) {
      state.columnWidth = action.payload
    },
    setColumnExpanded(state, action: PayloadAction<Record<string, boolean>>) {
      state.columnExpanded = action.payload
    },
    setColumnVisible(state, action: PayloadAction<Record<string, boolean>>) {
      state.columnVisible = action.payload
    },
    setColumnSorted(
      state,
      action: PayloadAction<Record<string, "asc" | "desc">>
    ) {
      state.columnSorted = action.payload
    },
    expandColumn(state, action: PayloadAction<string>) {
      state.columnExpanded[action.payload] = true
    },
    collapseColumn(state, action: PayloadAction<string>) {
      state.columnExpanded[action.payload] = false
    },
  },
})

const settingsReducer = settings.reducer

export const reducer = table.reducer
export const actions = {...table.actions, ...settings.actions}
export const initialSettings = settings.getInitialState
