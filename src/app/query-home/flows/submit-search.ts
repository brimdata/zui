import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Results from "src/js/state/Results"
import QueryVersions from "../../../js/state/QueryVersions"
import {MAIN_RESULTS} from "src/js/state/Results/types"
import {Thunk} from "src/js/state/types"
import {BrimQuery} from "../utils/brim-query"

const submitSearch =
  (): Thunk =>
  (dispatch, getState, {api}) => {
    const tabId = Current.getTabId(getState())
    const session = Current.getQueryById(tabId)(getState())
    const nextVersion = Editor.getSnapshot(getState())
    const query = Current.getQuery(getState())
    const error = BrimQuery.checkSyntax(nextVersion)

    // An error with the syntax
    if (error) {
      dispatch(Results.error({id: MAIN_RESULTS, error, tabId}))
      return
    }

    // Reuse the version url if the next version is the same as the latest
    // of this query, either session or saved.
    if (QueryVersions.areEqual(query.latestVersion(), nextVersion)) {
      api.queries.open(query.id, {version: query.latestVersionId()})
      return
    }

    // This is a new query, add a new version to the session,
    // And open the current active query with the version set to the new one.
    api.queries.addVersion(session.id, nextVersion)
    api.queries.open(query.id, {version: nextVersion.version})
  }

export default submitSearch
