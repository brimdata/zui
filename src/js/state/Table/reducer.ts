import {createSlice, PayloadAction as Payload} from "@reduxjs/toolkit"
import {zed} from "@brimdata/zealot"
import {defaultState, ZedTableState} from "src/components/zed-table/types"

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
  },
  extraReducers: (builder) => {
    builder.addCase("VIEWER_CLEAR", (s) => {
      s.scrollPosition = {top: 0, left: 0}
      if (s.lastShape) {
        const state = s.states.get(s.lastShape)
        if (state) {
          const {columnExpanded} = state
          s.states.set(s.lastShape, {...defaultState(), columnExpanded})
        }
      }
    })
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
