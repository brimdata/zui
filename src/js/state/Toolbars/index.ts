import {createEntityAdapter, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {State} from "../types"

export type ToolbarsState = {
  search: ToolbarState
  detail: ToolbarState
}
export type ToolbarItem = {
  id: string
  order: number
  label?: string
  icon: string
  disabled: boolean
  tooltip?: string
  command: string
  buttonProps?: object
}

export type ToolbarState = ReturnType<typeof slice.reducer>

const adapter = createEntityAdapter<ToolbarItem>({
  sortComparer: (a, b) => a.order - b.order,
})

const slice = createSlice({
  name: "toolbars",
  initialState: {
    search: adapter.getInitialState(),
    detail: adapter.getInitialState(),
  },
  reducers: {
    createItem(
      state,
      action: PayloadAction<{toolbarId: string; item: ToolbarItem}>
    ) {
      const {toolbarId, item} = action.payload
      adapter.addOne(state[toolbarId], item)
    },
    updateItem(
      state,
      action: PayloadAction<{
        toolbarId: string
        itemId: string
        item: Partial<ToolbarItem>
      }>
    ) {
      const {toolbarId, itemId, item} = action.payload
      adapter.updateOne(state[toolbarId], {id: itemId, changes: item})
    },
  },
})

const selectors = adapter.getSelectors()

export default {
  reducer: slice.reducer,
  ...slice.actions,
  getToolbarItem: (toolbarId: string, itemId: string) => (state: State) =>
    selectors.selectById(state.toolbars[toolbarId], itemId),
  allToolbarItems: (toolbarId: string) => (state: State) =>
    selectors.selectAll(state.toolbars[toolbarId]),
}
