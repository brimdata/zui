import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {zed} from "packages/zealot/src"
import {ZedTableState} from "src/components/zed-table/types"

const slice = createSlice({
  name: "TAB_TABLE",
  initialState: {
    states: new Map<zed.Type, ZedTableState>(),
    scrollPosition: {top: 0, left: 0},
  },
  reducers: {
    setStateForShape: (
      s,
      a: PayloadAction<{shape: zed.Type; state: ZedTableState}>
    ) => {
      s.states.set(a.payload.shape, a.payload.state)
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
