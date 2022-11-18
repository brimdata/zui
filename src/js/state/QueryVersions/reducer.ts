import {createReducer, PayloadAction} from "@reduxjs/toolkit"
import {
  createNestedEntitySlice,
  initialState,
} from "../entity-slice/create-entity-slice"
import {actions as tabs} from "../Tabs/reducer"
import {State} from "../types"
import {QueryVersion} from "./types"

type VersionMeta = {queryId: string}

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
    if (!state.queryVersions) return initialState()
    return state.queryVersions[meta.queryId] ?? initialState()
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

  builder.addMatcher(
    ({type}) => type == tabs.remove.toString(),
    (s, a) => {
      delete s[a.payload]
    }
  )
})
