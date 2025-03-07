import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {DateTuple} from "src/js/lib/TimeWindow"
import {Interval} from "src/views/histogram-pane/get-interval"

const slice = createSlice({
  name: "TAB_HISTOGRAM",
  initialState: {
    interval: null as null | Interval,
    range: null as null | DateTuple,
    nullXCount: 0,
    missingXCount: 0,
    canRender: true,
  },
  reducers: {
    init(s) {
      s.nullXCount = 0
      s.missingXCount = 0
      s.canRender = true
    },
    setRange(s, a: PayloadAction<DateTuple | null>) {
      s.range = a.payload
    },
    setInterval(s, a: PayloadAction<Interval | null>) {
      s.interval = a.payload
    },
    setNullXCount(s, a: PayloadAction<number>) {
      s.nullXCount = a.payload
    },
    setMissingXCount(s, a: PayloadAction<number>) {
      s.missingXCount = a.payload
    },
    setCanRender(s, a: PayloadAction<boolean>) {
      s.canRender = a.payload
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
