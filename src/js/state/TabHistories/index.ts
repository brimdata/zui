import {createEntityAdapter, createSlice} from "@reduxjs/toolkit"
import {actions as tabs} from "../Tabs/reducer"
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
    [tabs.remove.toString()]: (
      state,
      action: ReturnType<typeof tabs.remove>
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
