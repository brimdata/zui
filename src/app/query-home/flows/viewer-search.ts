import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "src/js/flows/config"
import ErrorFactory from "src/js/models/ErrorFactory"
import Columns from "src/js/state/Columns"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import Viewer from "src/js/state/Viewer"
import search from "./search"
import {BrimQuery} from "../utils/brim-query"

type Args = {
  query: BrimQuery
  keep?: boolean
  append?: boolean
}

const id = "Table"

export function viewerSearch(args: Args): Thunk<void> {
  return async (dispatch, getState) => {
    const tabId = Tabs.getActive(getState())
    const currentSearchKey = Viewer.getSearchKey(getState())
    if (!args.append) {
      dispatch(Viewer.clear(tabId))
      dispatch(Viewer.setSearchKey(tabId, currentSearchKey))
    }

    dispatch(Viewer.setStatus(tabId, "FETCHING"))
    dispatch(Viewer.setEndStatus(tabId, "FETCHING"))

    const prevRows = Viewer.getRecords(getState())

    try {
      const res = await dispatch(
        search({
          id,
          query: args.query,
          initial: !args.append,
        })
      )
      await res.collect(({rows, shapesMap}) => {
        dispatch(Viewer.setRecords(tabId, [...prevRows, ...rows]))
        dispatch(Viewer.updateColumns(tabId, shapesMap))
        dispatch(Columns.touch(shapesMap))
      })
      dispatch(Viewer.setStatus(tabId, "SUCCESS"))
      dispatch(Viewer.setEndStatus(tabId, endStatus(res.rows.length)))
    } catch (e) {
      dispatch(Viewer.setStatus(tabId, "ERROR"))
      dispatch(Viewer.setEndStatus(tabId, endStatus(0)))
      dispatch(Viewer.setError(ErrorFactory.create(e).message, tabId))
    }
  }
}

function endStatus(count) {
  if (count === PER_PAGE) return "INCOMPLETE"
  if (count === ANALYTIC_MAX_RESULTS) return "LIMIT"
  return "COMPLETE"
}
