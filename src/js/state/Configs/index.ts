import {createEntityAdapter, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {State} from "../types"

type ConfigItemType = "string" // | "number" | "boolean"
// type ConfigItemFormat = "file" | "date"

export type ConfigItem = {
  name: string
  type: ConfigItemType
  label: string
  // description?: string
  command?: string
  // format?: ConfigItemFormat
  // pattern?: RegExp
  defaultValue: string
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
    create: adapter.addOne,
    delete: adapter.removeOne,
    updatePropertyDefault(
      state,
      action: PayloadAction<{
        configName: string
        propertyName: string
        defaultValue: string
      }>
    ) {
      const {configName, propertyName, defaultValue} = action.payload
      const property = state.entities[configName]?.properties[propertyName]
      if (!property) {
        console.error(
          `cannot find property '${propertyName}' for config '${configName}'`
        )
        return
      }

      property.defaultValue = defaultValue
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
