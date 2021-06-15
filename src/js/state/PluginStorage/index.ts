import {createEntityAdapter, createSlice} from "@reduxjs/toolkit"
import {State} from "../types"

export type PluginStorage = {name: string; data: any}
export type PluginStorageState = ReturnType<typeof slice.reducer>

const adapter = createEntityAdapter<PluginStorage>({
  selectId: (plugin) => plugin.name
})

const initialState = adapter.getInitialState()
const slice = createSlice({
  name: "$pluginStorage",
  initialState,
  reducers: {
    set(state, action) {
      adapter.upsertOne(state, action.payload)
    },
    delete(state, action) {
      adapter.removeOne(state, action.payload)
    }
  }
})

const selectors = adapter.getSelectors((state: State) => state.pluginStorage)

export default {
  reducer: slice.reducer,
  ...slice.actions,
  getData: (name) => (state) => selectors.selectById(state, name)?.data,
  all: selectors.selectAll
}
