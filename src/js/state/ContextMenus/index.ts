import {createEntityAdapter, createSlice, PayloadAction} from "@reduxjs/toolkit"
import {State} from "../types"

export type ContextMenusState = {
  search: ContextMenuState
  detail: ContextMenuState
}
export type ContextMenuItem = {
  id: string
  order: number
  label: string
  disabled: boolean
  command: string
}

export type ContextMenuState = ReturnType<typeof slice.reducer>

const adapter = createEntityAdapter<ContextMenuItem>({
  sortComparer: (a, b) => a.order - b.order
})

const slice = createSlice({
  name: "contextMenus",
  initialState: {
    search: adapter.getInitialState(),
    detail: adapter.getInitialState()
  },
  reducers: {
    createItem(
      state,
      action: PayloadAction<{ctxMenuId: string; item: ContextMenuItem}>
    ) {
      const {ctxMenuId, item} = action.payload
      adapter.addOne(state[ctxMenuId], item)
    },
    updateItem(
      state,
      action: PayloadAction<{
        ctxMenuId: string
        itemId: string
        item: Partial<ContextMenuItem>
      }>
    ) {
      const {ctxMenuId, itemId, item} = action.payload
      adapter.updateOne(state[ctxMenuId], {id: itemId, changes: item})
    }
  }
})

const selectors = adapter.getSelectors()

export default {
  reducer: slice.reducer,
  ...slice.actions,
  getContextMenuItem: (ctxMenuId: string, itemId: string) => (state: State) =>
    selectors.selectById(state.contextMenus[ctxMenuId], itemId),
  allContextMenuItems: (ctxMenuId: string) => (state: State) =>
    selectors.selectAll(state.contextMenus[ctxMenuId])
}
