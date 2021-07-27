import {createEntityAdapter, createSlice} from "@reduxjs/toolkit"
import {State} from "../types"

export type ConfigItemType = "file" | "string" | "directory" // | "number" | "boolean"

export type ConfigItem = {
  name: string
  type: ConfigItemType
  label: string
  helpLink?: {
    label: string
    url: string
  }
  command?: string
  defaultValue?: string
  enum?: string[]
}

export type Config = {
  name: string
  title: string
  properties: {[configItemName: string]: ConfigItem}
}

export type ConfigsState = ReturnType<typeof slice.reducer>

const adapter = createEntityAdapter<Config>({
  selectId: (config) => config.name
})

const slice = createSlice({
  name: "$configs",
  initialState: adapter.getInitialState(),
  reducers: {
    set(state, action) {
      adapter.upsertOne(state, action.payload)
    },
    delete(state, action) {
      adapter.removeOne(state, action.payload)
    }
  }
})

const selectors = adapter.getSelectors((state: State) => state.configs)

export default {
  reducer: slice.reducer,
  ...slice.actions,
  get: (name) => (state) => selectors.selectById(state, name),
  all: selectors.selectAll
}
