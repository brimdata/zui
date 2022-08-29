import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {DateTuple} from "src/js/lib/TimeWindow"

const slice = createSlice({
  name: "TAB_HISTOGRAM",
  initialState: {
    x: "ts",
    by: "_path",
    range: null as null | DateTuple,
  },
  reducers: {
    setRange(s, a: PayloadAction<DateTuple | null>) {
      s.range = a.payload
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
