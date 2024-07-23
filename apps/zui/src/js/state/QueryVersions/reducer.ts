import {createReducer, PayloadAction} from "@reduxjs/toolkit"
import {
  createNestedEntitySlice,
  initialState,
} from "../entity-slice/create-entity-slice"
import {State} from "../types"
import {QueryVersion} from "./types"

type VersionMeta = {queryId: string}

const initial = initialState()

export const versionSlice = createNestedEntitySlice<
  QueryVersion,
  {queryId: string},
  [queryId: string]
>({
  name: "$version",
  id: (v) => v.version,
  sort: (a, b) => (a.ts > b.ts ? 1 : -1),
  meta: (queryId) => ({queryId}),
  select: (state: State, meta) => {
    if (!state.queryVersions) return initial
    return state.queryVersions[meta.queryId] ?? initial
  },
})

export const reducer = createReducer({}, (builder) => {
  builder.addMatcher(
    ({type}) => type.startsWith(versionSlice.name),
    (state, action: PayloadAction<unknown, string, VersionMeta>) => {
      const id = action.meta.queryId
      state[id] = versionSlice.reducer(state[id], action)
      if (!state[id].ids.length) delete state[id]
    }
  )
})
