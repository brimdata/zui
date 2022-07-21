import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Notice from "src/js/state/Notice"
import Results from "src/js/state/Results"
import tabHistory from "../../router/tab-history"
import {lakeQueryPath} from "../../router/utils/paths"
import SessionHistories from "src/js/state/SessionHistories"
import QueryVersions from "../../../js/state/QueryVersions"

const submitSearch = () => (dispatch, getState) => {
  dispatch(Notice.dismiss())
  dispatch(Results.error(null))
  const lakeId = Current.getLakeId(getState())
  const tabId = Current.getTabId(getState())
  const query = Current.getQuery(getState())
  let sessionQuery = Current.getQueryById(tabId)(getState())
  const {queryId: pathQueryId} = Current.getQueryLocationData(getState())
  const value = Editor.getValue(getState())
  const pins = Editor.getPins(getState())
  sessionQuery = sessionQuery.newVersion(value, pins)
  const error = sessionQuery.checkSyntax()
  if (error) {
    dispatch(Results.error(error))
    return
  }
  if (!query.isReadOnly) {
    dispatch(
      QueryVersions.add({
        queryId: sessionQuery.id,
        version: sessionQuery.latestVersion(),
      })
    )
    dispatch(
      tabHistory.push(
        lakeQueryPath(pathQueryId, lakeId, sessionQuery.latestVersionId())
      )
    )
    dispatch(SessionHistories.push(pathQueryId, sessionQuery.latestVersionId()))
  } else {
    const version = query.latestVersion().version
    dispatch(tabHistory.replace(lakeQueryPath(pathQueryId, lakeId, version)))
  }
}

export default submitSearch
