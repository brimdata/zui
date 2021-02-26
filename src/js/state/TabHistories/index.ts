import {createEntityAdapter, createSlice} from "@reduxjs/toolkit"
import {TABS_ADD, TABS_REMOVE} from "../Tabs/types"
import {State} from "../types"
import {SerializedHistory} from "./types"

const adapter = createEntityAdapter<SerializedHistory>()

const slice = createSlice({
  name: "tabHistories",
  initialState: adapter.getInitialState(),
  reducers: {
    save: adapter.setAll
  },
  extraReducers: {
    TABS_ADD: (state, action: TABS_ADD) => {
      global.tabHistories.create(action.id).replace(action.url)
      return state
    },
    TABS_REMOVE: (state, action: TABS_REMOVE) => {
      global.tabHistories.delete(action.id)
      return state
    }
  }
})

export default {
  reducer: slice.reducer,
  ...slice.actions,
  ...adapter.getSelectors((s: State) => s.tabHistories)
}
