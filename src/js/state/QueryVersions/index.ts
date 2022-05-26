import {createEntityAdapter, createSlice} from "@reduxjs/toolkit"
import {QueryPin} from "../Editor/types"

const versionAdapter = createEntityAdapter<QueryVersion>({
  selectId: (queryVersion) => queryVersion.version,
  sortComparer: (a, b) => (a.ts > b.ts ? 1 : -1),
})
const initialState = versionAdapter.getInitialState()
const versionSlice = createSlice({
  name: "$version",
  initialState,
  reducers: {
    set(state, action) {
      versionAdapter.setAll(state, action.payload.versions)
    },
    add(state, action) {
      versionAdapter.upsertOne(state, action.payload.version)
    },
    delete(state, action) {
      versionAdapter.removeOne(state, action.payload.version)
    },
    clear(state, _action) {
      versionAdapter.removeAll(state)
    },
  },
})

export type VersionsState = ReturnType<typeof versionSlice.reducer>
export type QueryVersionsState = {
  [queryId: string]: VersionsState
}

export type QueryVersion = {
  version: string
  ts: Date
  value: string
  pins?: QueryPin[]
}

const queryVersionsSlice = createSlice({
  name: "$queryVersions",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      ({type}) => type.startsWith(versionSlice.name),
      (s, a) => {
        s[a.payload.queryId] = versionSlice.reducer(s[a.payload.queryId], a)
        if (!versionAdapter.getSelectors().selectTotal(s[a.payload.queryId])) {
          delete s[a.payload.queryId]
        }
      }
    )
  },
})

export default {
  reducer: queryVersionsSlice.reducer,
  ...versionSlice.actions,
  raw: (state) => state.queryVersions,
  getByQueryId: (queryId) => (state) =>
    versionAdapter.getSelectors().selectAll(state.queryVersions[queryId]),
  getByVersion: (queryId, version) => (state) =>
    versionAdapter
      .getSelectors()
      .selectById(state.queryVersions[queryId], version),
}
