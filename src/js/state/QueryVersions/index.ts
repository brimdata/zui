import {queryVersionsSlice, versionAdapter, versionSlice} from "./reducer"

export default {
  reducer: queryVersionsSlice.reducer,
  ...versionSlice.actions,
  raw: (state) => state.queryVersions,
  getByQueryId: (queryId) => (state) => {
    const queryVersions = state.queryVersions[queryId]
    if (!queryVersions) return []
    return versionAdapter.getSelectors().selectAll(queryVersions)
  },
  getByVersion: (queryId, version) => (state) => {
    const versions = state.queryVersions[queryId]
    if (!versions) return null
    return versionAdapter.getSelectors().selectById(versions, version)
  },
}
