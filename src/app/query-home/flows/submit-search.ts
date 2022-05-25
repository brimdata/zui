import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Notice from "src/js/state/Notice"
import {newQueryVersion} from "./new-query-version"
import Results from "src/js/state/Results"
import tabHistory from "src/app/router/tab-history"
import {lakeQueryPath} from "src/app/router/utils/paths"

type SaveOpts = {history: boolean; investigation: boolean}

const submitSearch =
  (
    _save: SaveOpts = {history: true, investigation: true},
    _ts: Date = new Date()
  ) =>
  (dispatch, getState) => {
    console.log("submit search")
    dispatch(Notice.dismiss())
    dispatch(Results.error(null))
    const value = Editor.getValue(getState())
    const pins = Editor.getPins(getState())
    const prev = Current.getQuery(getState())
    dispatch(
      newQueryVersion(prev.id, {...prev.currentVersion(), value, pins})
    ).then(() => {
      const query = Current.getQuery(getState())
      const error = query.checkSyntax()
      if (error) {
        dispatch(Results.error(error))
        return
      }
      const lakeId = Current.getLakeId(getState())
      dispatch(tabHistory.push(lakeQueryPath(query.id, lakeId)))
    })
  }

export default submitSearch
