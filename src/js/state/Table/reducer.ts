import {createSlice, PayloadAction as Payload} from "@reduxjs/toolkit"
import {zed} from "packages/zealot/src"
import {ZedTableState} from "src/components/zed-table/types"

const slice = createSlice({
  name: "TAB_TABLE",
  initialState: {
    states: new Map<zed.Type, ZedTableState>(),
    scrollPosition: {top: 0, left: 0},
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
  },
  extraReducers: (builder) => {
    builder.addCase("VIEWER_CLEAR", (s) => {
      s.scrollPosition = {top: 0, left: 0}
      s.states = new Map()
    })
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
