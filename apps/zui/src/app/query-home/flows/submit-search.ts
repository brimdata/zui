import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Results from "src/js/state/Results"
import QueryVersions from "../../../js/state/QueryVersions"
import {Thunk} from "src/js/state/types"
import {QueryModel} from "../../../js/models/query-model"
import {RESULTS_QUERY} from "src/panes/results-pane/run-results-query"
import Table from "src/js/state/Table"
import Inspector from "src/js/state/Inspector"

const submitSearch =
  (): Thunk =>
  (dispatch, getState, {api}) => {
    dispatch(Table.setScrollPosition({top: 0, left: 0}))
    dispatch(Inspector.setScrollPosition({top: 0, left: 0}))

    const nextVersion = Editor.getSnapshot(getState())
    const active = Current.getActiveQuery(getState())
    const error = QueryModel.checkSyntax(nextVersion)

    // An error with the syntax
    if (error) {
      const tabId = Current.getTabId(getState())
      dispatch(Results.error({id: RESULTS_QUERY, error, tabId}))
      return
    }

    // Reuse the version url if the next version is the same as the latest
    // of this query, either session or saved.
    if (QueryVersions.areEqual(active.version, nextVersion)) {
      api.queries.open(active.id(), {version: active.versionId()})
      return
    }

    // This is a new query, add a new version to the session,
    // And open the current active query with the version set to the new one.
    api.queries.addVersion(active.session.id, nextVersion)
    api.queries.open(active.id(), {version: nextVersion.version})
  }

export default submitSearch
