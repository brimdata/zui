import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Notice from "src/js/state/Notice"
import Results from "src/js/state/Results"
import {BrimQuery} from "../utils/brim-query"
import {updateQuery} from "./update-query"

type SaveOpts = {history: boolean; investigation: boolean}

const submitSearch =
  (
    _save: SaveOpts = {history: true, investigation: true},
    _ts: Date = new Date()
  ) =>
  async (dispatch, getState) => {
    dispatch(Notice.dismiss())
    dispatch(Results.error(null))
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
      dispatch(Results.error(error))
      return
    }

    await dispatch(updateQuery(query))
    // TODO: Mason - refactor history to use query copies
    // if (save.investigation) {
    //   dispatch(Investigation.push(lakeId, poolId, record, brim.time(ts).toTs()))
    // }
    dispatch(Results.fetchFirstPage(query.toString()))
  }

export default submitSearch
