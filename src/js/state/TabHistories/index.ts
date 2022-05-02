import {createEntityAdapter, createSlice} from "@reduxjs/toolkit"
import Tabs from "../Tabs"
import {State} from "../types"
import {SerializedHistory} from "./types"

const adapter = createEntityAdapter<SerializedHistory>()

const slice = createSlice({
  name: "tabHistories",
  initialState: adapter.getInitialState(),
  reducers: {
    save: adapter.setAll,
  },
  extraReducers: {
    [Tabs.remove.toString()]: (
      state,
      action: ReturnType<typeof Tabs.remove>
    ) => {
      global.tabHistories.delete(action.payload)
      return state
    },
  },
})

export default {
  reducer: slice.reducer,
  ...slice.actions,
  ...adapter.getSelectors((s: State) => s.tabHistories),
}
