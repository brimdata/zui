import {queryVersionsSlice, versionAdapter, versionSlice} from "./reducer"

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
