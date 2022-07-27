import {createEntityAdapter, createSlice} from "@reduxjs/toolkit"
import Tabs from "../Tabs"
import {QueryVersion} from "./types"

export const versionAdapter = createEntityAdapter<QueryVersion>({
  selectId: (queryVersion) => queryVersion.version,
  sortComparer: (a, b) => (a.ts > b.ts ? 1 : -1),
})
const initialState = versionAdapter.getInitialState()
export const versionSlice = createSlice({
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

export const queryVersionsSlice = createSlice({
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
    builder.addMatcher(
      ({type}) => type == Tabs.remove.toString(),
      (s, a) => {
        delete s[a.payload]
      }
    )
  },
})
