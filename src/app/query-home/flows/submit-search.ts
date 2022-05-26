import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Notice from "src/js/state/Notice"
import {saveQueryVersion} from "../../../js/state/QueryVersions/flows/save-query-version"
import Results from "src/js/state/Results"
import tabHistory from "../../router/tab-history"
import {lakeQueryPath} from "../../router/utils/paths"

type SaveOpts = {history: boolean; version: boolean}

const submitSearch =
  (save: SaveOpts = {history: true, version: true}, _ts: Date = new Date()) =>
  (dispatch, getState) => {
    dispatch(Notice.dismiss())
    dispatch(Results.error(null))
    const lakeId = Current.getLakeId(getState())
    let query = Current.getQuery(getState())
    const value = Editor.getValue(getState())
    const pins = Editor.getPins(getState())
    query = query.newVersion(value, pins)
    const error = query.checkSyntax()
    if (error) {
      dispatch(Results.error(error))
      return
    }
    if (save.version && !query.isReadOnly) {
      dispatch(saveQueryVersion(query.id, query.latestVersion())).then(() => {
        dispatch(tabHistory.push(lakeQueryPath(query.id, lakeId)))
      })
    } else {
      dispatch(tabHistory.push(lakeQueryPath(query.id, lakeId)))
    }

    // TODO: Mason - refactor history to use query copies
    // if (save.history) {
    //   dispatch(Investigation.push(lakeId, poolId, record, brim.time(ts).toTs()))
    // }
  }

export default submitSearch
