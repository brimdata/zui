import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {DateTuple} from "src/js/lib/TimeWindow"
import {Interval} from "src/panes/histogram-pane/get-interval"

const slice = createSlice({
  name: "TAB_HISTOGRAM",
  initialState: {
    interval: null as null | Interval,
    range: null as null | DateTuple,
    nulls: 0,
  },
  reducers: {
    init(s) {
      s.nulls = 0
    },
    setRange(s, a: PayloadAction<DateTuple | null>) {
      s.range = a.payload
    },
    setInterval(s, a: PayloadAction<Interval | null>) {
      s.interval = a.payload
    },
    setNulls(s, a: PayloadAction<number>) {
      s.nulls = a.payload
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
