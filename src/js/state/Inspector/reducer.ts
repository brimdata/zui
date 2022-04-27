import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {RowData} from "src/app/features/inspector/types"

const slice = createSlice({
  name: "TAB_INSPECTOR",
  initialState: {
    rows: [] as RowData[],
    expanded: new Map<string, boolean>(),
    defaultExpanded: false,
    scrollPosition: {top: 0, left: 0},
  },
  reducers: {
    appendRows: (s, a: PayloadAction<RowData[]>) => {
      s.rows = s.rows.concat(a.payload)
    },
    setExpanded(s, a: PayloadAction<{key: string; isExpanded: boolean}>) {
      const {key, isExpanded} = a.payload
      s.expanded.set(key, isExpanded)
    },
    spliceRows: (s, a: PayloadAction<number>) => {
      s.rows.splice(a.payload)
    },
    setAllExpanded: (s, a: PayloadAction<boolean>) => {
      s.expanded = new Map<any, any>()
      s.defaultExpanded = a.payload
      s.rows = []
    },
    setScrollPosition: (s, a: PayloadAction<{top: number; left: number}>) => {
      s.scrollPosition = a.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase("VIEWER_CLEAR", (s) => {
      s.rows = []
      s.expanded = new Map<string, boolean>()
    })
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
