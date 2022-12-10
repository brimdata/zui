import {createSlice, PayloadAction} from "@reduxjs/toolkit"

const slice = createSlice({
  name: "TAB_TABLE",
  initialState: {
    expanded: new Map<string, boolean>(),
    valuePages: new Map<string, number>(),
    columnWidths: new Map<string, number>(),
    defaultExpanded: false,
    scrollPosition: {top: 0, left: 0},
  },
  reducers: {
    renderMore: (s, a: PayloadAction<{key: string}>) => {
      const {key} = a.payload
      const page = s.valuePages.get(key) || 1
      s.valuePages.set(key, page + 1)
    },
    setExpanded(s, a: PayloadAction<{key: string; isExpanded: boolean}>) {
      const {key, isExpanded} = a.payload
      s.expanded.set(key, isExpanded)
    },
    setAllExpanded: (s, a: PayloadAction<boolean>) => {
      s.expanded = new Map<any, any>()
      s.defaultExpanded = a.payload
    },
    setScrollPosition: (s, a: PayloadAction<{top: number; left: number}>) => {
      s.scrollPosition = a.payload
    },
    setColumnWidths: (s, a: PayloadAction<Record<string, number>>) => {
      for (let id in a.payload) {
        s.columnWidths.set(id, a.payload[id])
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase("VIEWER_CLEAR", (s) => {
      s.expanded = new Map<string, boolean>()
      s.valuePages = new Map<string, number>()
    })
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
