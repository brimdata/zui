import {createSlice, PayloadAction} from "@reduxjs/toolkit"

const slice = createSlice({
  name: "TAB_INSPECTOR",
  initialState: {
    expanded: {} as Record<string, boolean>,
    expandedDefault: false,
    pages: {} as Record<string, number>,
    scrollPosition: {top: 0, left: 0},
  },
  reducers: {
    setPages(state, action: PayloadAction<Record<string, number>>) {
      state.pages = action.payload
    },
    setExpanded(state, action: PayloadAction<Record<string, boolean>>) {
      state.expanded = action.payload
    },
    setExpandedDefault(state, action: PayloadAction<boolean>) {
      state.expandedDefault = action.payload
    },
    setScrollPosition(
      state,
      action: PayloadAction<{top: number; left: number}>
    ) {
      state.scrollPosition = action.payload
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
