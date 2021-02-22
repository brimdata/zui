import {createEntityAdapter, createSlice} from "@reduxjs/toolkit"
import {State} from "../types"
import {SerializedHistory} from "./types"

const adapter = createEntityAdapter<SerializedHistory>()

const slice = createSlice({
  name: "tabHistories",
  initialState: adapter.getInitialState(),
  reducers: {
    save: adapter.setAll
  }
})

export default {
  reducer: slice.reducer,
  ...slice.actions,
  ...adapter.getSelectors((s: State) => s.tabHistories)
}
