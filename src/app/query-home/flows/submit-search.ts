import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Notice from "src/js/state/Notice"
import {newQueryVersion} from "./new-query-version"
import Results from "src/js/state/Results"

type SaveOpts = {history: boolean; investigation: boolean}

const submitSearch =
  (
    _save: SaveOpts = {history: true, investigation: true},
    _ts: Date = new Date()
  ) =>
  (dispatch, getState) => {
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
      // TODO: Mason - refactor history to use query copies
      // if (save.investigation) {
      //   dispatch(Investigation.push(lakeId, poolId, record, brim.time(ts).toTs()))
      // }
      dispatch(Results.fetchFirstPage(query.toString()))
    })
  }

export default submitSearch
