import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {InspectArgs, RowData} from "src/app/features/inspector/types"

const slice = createSlice({
  name: "TAB_INSPECTOR",
  initialState: {
    rows: [] as RowData[],
    scrollTop: 0,
    maxVisibleRowIndex: 0,
    expanded: new Map<any, any>(),
    defaultExpanded: false
  },
  reducers: {
    setMaxVisibleRowIndex: (s, a: PayloadAction<number>) => {
      s.maxVisibleRowIndex = a.payload
    },
    appendRows: (s, a: PayloadAction<RowData[]>) => {
      s.rows = s.rows.concat(a.payload)
    },
    setExpanded(s, a: PayloadAction<{args: InspectArgs; isExpanded: boolean}>) {
      const {value} = a.payload.args
      s.expanded.set(value, a.payload.isExpanded)
    },
    spliceRows: (s, a: PayloadAction<number>) => {
      s.rows.splice(a.payload)
    },
    setAllExpanded: (s, a: PayloadAction<boolean>) => {
      s.expanded = new Map<any, any>()
      s.defaultExpanded = a.payload
      s.rows = []
    },
    setScrollTop: (s, a: PayloadAction<number>) => {
      s.scrollTop = a.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase("VIEWER_CLEAR", (s) => {
      s.rows = []
      s.maxVisibleRowIndex = 0
      s.scrollTop = 0
      s.expanded = new Map<any, any>()
    })
  }
})

export const reducer = slice.reducer
export const actions = slice.actions
