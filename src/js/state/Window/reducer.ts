import {PayloadAction, createSlice} from "@reduxjs/toolkit"
import {isTabsAction} from "./is-tabs-action"
import Tabs from "../Tabs"
import {TabsState} from "../Tabs/types"
import {isReduxAction} from "../Tabs/is-redux-action"

const INIT = {type: "@@INIT"}

const slice = createSlice({
  name: "WINDOW",
  initialState: {
    tabs: {} as Record<string, TabsState>,
    lakeId: null as string | null,
  },
  reducers: {
    setLakeId: (state, action: PayloadAction<string>) => {
      const id = action.payload
      const next = Tabs.reducer(state.tabs[id], INIT)
      state.lakeId = id
      state.tabs[id] = next
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(isTabsAction, (state, action) => {
      const id = state.lakeId
      const next = Tabs.reducer(state.tabs[id], action)
      state.tabs[id] = next
    })
    builder.addMatcher(isReduxAction, (state, action) => {
      for (const id in state.tabs) {
        const next = Tabs.reducer(state.tabs[id], action)
        state.tabs[id] = next
      }
    })
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
