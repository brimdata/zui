import {createSlice, PayloadAction as Pay} from "@reduxjs/toolkit"
import * as zed from "../../../../../../packages/superdb-types/dist"
import {ResultsState} from "./types"
import {initialResultData} from "./util"

export function access(state: ResultsState, id: string) {
  if (state[id]) return state[id]
  else return (state[id] = initialResultData())
}

/**
 * All of these actions need the tabId so that
 * results are stored in the correct place.
 * See where it's used in the Tabs reducer.
 */
const slice = createSlice({
  name: "TAB_RESULTS",
  initialState: {} as ResultsState,
  reducers: {
    init(
      s,
      a: Pay<{
        id: string
        query: string
        key: string
        tabId: string
      }>
    ) {
      const r = access(s, a.payload.id)
      r.query = a.payload.query
      r.key = a.payload.key
      r.canPaginate = false
      r.page = 1
      r.status = "FETCHING"
      r.values = []
      r.shapes = {}
    },

    nextPage(s, a: Pay<{id: string}>) {
      const r = access(s, a.payload.id)
      r.page += 1
      r.status = "FETCHING"
    },

    setValues(s, a: Pay<{id: string; values: zed.Value[]; tabId: string}>) {
      const r = access(s, a.payload.id)
      r.values = a.payload.values
    },

    setShapes(
      s,
      a: Pay<{id: string; shapes: {[id: string]: zed.Type}; tabId: string}>
    ) {
      const r = access(s, a.payload.id)
      r.shapes = a.payload.shapes
    },

    setCanPaginate(
      s,
      a: Pay<{id: string; canPaginate: boolean; tabId: string}>
    ) {
      const r = access(s, a.payload.id)
      r.canPaginate = a.payload.canPaginate
    },

    success(s, a: Pay<{id: string; count?: number; tabId: string}>) {
      const r = access(s, a.payload.id)
      if (a.payload.count === r.perPage) {
        r.status = "INCOMPLETE"
      } else {
        r.status = "COMPLETE"
      }
      r.error = null
    },

    error: (s, a: Pay<{id: string; error: any; tabId?: string}>) => {
      const r = access(s, a.payload.id)
      r.error = a.payload.error
      r.status = "ERROR"
    },
  },
})

export const actions = slice.actions
export const reducer = slice.reducer
