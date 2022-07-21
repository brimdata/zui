import {Pool} from "src/app/core/pools/pool"
import submitSearch from "src/app/query-home/flows/submit-search"
import {lakeQueryPath} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import SessionHistories from "src/js/state/SessionHistories"
import SessionQueries from "src/js/state/SessionQueries"
import {Thunk} from "src/js/state/types"
import tabHistory from "../../../router/tab-history"

export function poolClick(pool: Pool): Thunk {
  return (dispatch, getState) => {
    const query = Current.getQuery(getState())
    const lakeId = Current.getLakeId(getState())
    if (query) {
      dispatch(Editor.setFrom(pool.name))
      dispatch(submitSearch())
    } else {
      const newQuery = dispatch(
        SessionQueries.create({
          pins: [{type: "from", value: pool.name}],
        })
      )
      const versionId = newQuery.latestVersionId()

      dispatch(SessionHistories.push(newQuery.id, versionId))
      dispatch(tabHistory.push(lakeQueryPath(newQuery.id, lakeId, versionId)))
    }
  }
}
