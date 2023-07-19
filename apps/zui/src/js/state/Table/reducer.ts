import {createSlice, PayloadAction as Payload} from "@reduxjs/toolkit"
import * as zed from "@brimdata/zed-js"
import {ZedTableState} from "src/components/zed-table/types"

const slice = createSlice({
  name: "TAB_TABLE",
  initialState: {
    states: new Map<zed.Type, ZedTableState>(),
    scrollPosition: {top: 0, left: 0},
    lastShape: null as zed.Type | null,
  },
  reducers: {
    setStateForShape(
      state,
      action: Payload<{shape: zed.Type; state: ZedTableState}>
    ) {
      state.states.set(action.payload.shape, action.payload.state)
    },
    setScrollPosition(state, action: Payload<{top: number; left: number}>) {
      state.scrollPosition = action.payload
    },
    setLastShape(state, action: Payload<zed.Type>) {
      state.lastShape = action.payload
    },
    setValueExpanded(state, action: Payload<Record<string, boolean>>) {
      const prev = state.states.get(state.lastShape)
      state.states.set(state.lastShape, {
        ...prev,
        valueExpanded: action.payload,
      })
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
