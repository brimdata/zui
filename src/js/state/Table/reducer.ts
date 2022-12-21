import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {zed} from "packages/zealot/src"

const slice = createSlice({
  name: "TAB_TABLE",
  initialState: {
    expanded: new Map<string, boolean>(),
    valuePages: new Map<string, number>(),
    columnWidths: new Map<zed.Type, Record<string, number>>(),
    columnGroups: new Map<zed.Type, Record<string, boolean>>(),
    defaultExpanded: false,
    scrollPosition: {top: 0, left: 0},
  },
  reducers: {
    incValuePage: (s, a: PayloadAction<{key: string}>) => {
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
    setColumnWidths: (
      s,
      a: PayloadAction<{shape: zed.Type; widths: Record<string, number>}>
    ) => {
      const {shape, widths} = a.payload
      let config = s.columnWidths.get(shape)
      if (!config) {
        config = {}
        s.columnWidths.set(shape, config)
      }
      for (let id in widths) config[id] = widths[id]
    },
    setColumnGroups: (
      s,
      a: PayloadAction<{shape: zed.Type; groups: Record<string, boolean>}>
    ) => {
      const {shape, groups} = a.payload
      let config = s.columnGroups.get(shape)
      if (!config) {
        config = {}
        s.columnGroups.set(shape, config)
      }
      for (let id in groups) config[id] = groups[id]
    },
  },
  extraReducers: (builder) => {
    builder.addCase("VIEWER_CLEAR", (s) => {
      s.expanded.clear()
      s.valuePages.clear()
    })
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
