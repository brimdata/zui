import {createSlice, PayloadAction as PA} from "@reduxjs/toolkit"
import activeTabSelect from "src/js/state/Tab/activeTabSelect"
import {RowData} from "./types"

const slice = createSlice({
  name: "TAB_INSPECTOR",
  initialState: {
    rows: [] as RowData[],
    rowStop: 0,
    valueStart: 0
  },
  reducers: {
    setStopIndex: (s, a: PA<number>) => {
      s.rowStop = a.payload
    },
    setRows: (s, a: PA<RowData[]>) => {
      s.rows = a.payload
    },
    setValueStart: (s, a: PA<number>) => {
      s.valueStart = a.payload
    }
  }
})

export const getRows = activeTabSelect((t) => t.inspector.rows)
export const getRowStop = activeTabSelect((t) => t.inspector.rowStop)
export const getValueStart = activeTabSelect((t) => t.inspector.valueStart)
export const reducer = slice.reducer
export const actions = slice.actions
