import {createSlice} from "@reduxjs/toolkit"
import {Query} from "../Queries/types"

export type DraftQueriesState = {
  [queryId: string]: Query
}

const slice = createSlice({
  name: "$draftQueries",
  initialState: {},
  reducers: {
    set(s, a) {
      s[a.payload.id] = a.payload
    },
    remove(s, a) {
      delete s[a.payload.id]
    },
  },
})

export default {
  reducer: slice.reducer,
  ...slice.actions,
  raw: (s) => s.draftQueries,
  getById:
    (id: string) =>
    (s): Query =>
      s.draftQueries[id],
}
