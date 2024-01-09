import {PayloadAction, createSlice} from "@reduxjs/toolkit"
import * as zed from "@brimdata/zed-js"

const slice = createSlice({
  name: "TAB_SELECTION",
  initialState: {
    value: null as zed.Value | null,
    field: null as zed.Field | null,
    rootValue: null as zed.Value | null,
  },
  reducers: {
    set(
      _,
      action: PayloadAction<{
        value: zed.Value | null
        field: zed.Field | null
        rootValue: zed.Value | null
      }>
    ) {
      return action.payload
    },
    reset() {
      return {value: null, field: null, rootValue: null}
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
