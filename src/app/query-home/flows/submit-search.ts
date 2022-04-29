import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import {updateQuery} from "./update-query"
import initialViewerSearch from "./initial-viewer-search"
import Editor from "src/js/state/Editor"
import {BrimQuery} from "../utils/brim-query"
import Viewer from "src/js/state/Viewer"

type SaveOpts = {history: boolean; investigation: boolean}

const submitSearch =
  (
    _save: SaveOpts = {history: true, investigation: true},
    _ts: Date = new Date()
  ) =>
  async (dispatch, getState) => {
    dispatch(Notice.dismiss())
    dispatch(Viewer.setError(null))
    const value = Editor.getValue(getState())
    const pins = Editor.getPins(getState())
    const prev = Current.getQuery(getState())
    const query = new BrimQuery({
      ...prev?.serialize(),
      value,
      pins,
    })
    const error = query.checkSyntax()
    if (error) {
      dispatch(Viewer.setError(error))
      return
    }
    console.log(query.toString())
    await dispatch(updateQuery(query))
    // TODO: Mason - refactor history to use query copies
    // if (save.investigation) {
    //   dispatch(Investigation.push(lakeId, poolId, record, brim.time(ts).toTs()))
    // }
    dispatch(initialViewerSearch())
  }

export default submitSearch
