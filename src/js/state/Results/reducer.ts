import {createSlice, PayloadAction as Pay} from "@reduxjs/toolkit"
import {zed} from "@brimdata/zealot"
import program from "src/js/brim/program"
import {ResultsStatus} from "./types"

const slice = createSlice({
  name: "TAB_RESULTS",
  initialState: {
    values: [] as zed.Value[],
    shapes: {} as {[id: string]: zed.Type},
    status: "INIT" as ResultsStatus,
    page: 1,
    perPage: 500,
    aggregationLimit: 2000,
    aggregation: false,
    key: "",
    query: "*",
    error: null as null | any,
  },
  reducers: {
    init(s, a: Pay<{query: string; key: string}>) {
      s.query = a.payload.query
      s.aggregation = program(a.payload.query).hasAnalytics()
      s.key = a.payload.key
      s.values = []
      s.shapes = {}
      s.page = 1
      s.status = "FETCHING"
      s.error = null
    },

    nextPage(s) {
      s.page += 1
      s.status = "FETCHING"
    },

    setValues: {
      prepare: (values: zed.Value[], tabId: string) => ({
        payload: {tabId, values},
      }),
      reducer: (s, a: Pay<{values: zed.Value[]}>) => {
        s.values = a.payload.values
      },
    },

    setShapes: {
      prepare: (shapes: {[id: string]: zed.Type}, tabId: string) => ({
        payload: {tabId, shapes},
      }),
      reducer: (s, a: Pay<{shapes: {[id: string]: zed.Type}}>) => {
        s.shapes = a.payload.shapes
      },
    },

    success: {
      prepare: (count: number, tabId: string) => ({
        payload: {count, tabId},
      }),
      reducer: (s, a: Pay<{count: number}>) => {
        if (s.aggregation && a.payload.count === s.aggregationLimit) {
          s.status = "LIMIT"
        } else if (a.payload.count === s.perPage) {
          s.status = "INCOMPLETE"
        } else {
          s.status = "COMPLETE"
        }
        s.error = null
      },
    },

    error: {
      prepare: (error: any, tabId?: string) => ({
        payload: {error, tabId},
      }),
      reducer: (s, a: Pay<{error: any}>) => {
        s.error = a.payload.error
        s.status = "ERROR"
      },
    },
  },
})

export const actions = slice.actions
export const reducer = slice.reducer
