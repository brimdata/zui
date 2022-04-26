import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "src/js/flows/config"
import {search} from "src/js/flows/search/mod"
import ErrorFactory from "src/js/models/ErrorFactory"
import Columns from "src/js/state/Columns"
import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import Viewer from "src/js/state/Viewer"

type Args = {
  query: string
  from: Date
  to: Date
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

    let res
    try {
      res = await dispatch(
        search({
          id,
          query: args.query,
          poolId: Current.mustGetPool(getState()).id,
          from: args.from,
          to: args.to,
          initial: !args.append,
        })
      )
      await res.collect(({rows, shapesMap}) => {
        dispatch(Viewer.setRecords(tabId, [...prevRows, ...rows]))
        dispatch(Viewer.updateColumns(tabId, shapesMap))
        dispatch(Columns.touch(shapesMap))
      })
    } catch (e) {
      dispatch(Viewer.setStatus(tabId, "ERROR"))
      dispatch(Notice.set(ErrorFactory.create(e)))
    } finally {
      dispatch(Viewer.setStatus(tabId, "SUCCESS"))
      dispatch(Viewer.setEndStatus(tabId, endStatus(res.rows.length)))
    }
  }
}

function endStatus(count) {
  if (count === PER_PAGE) return "INCOMPLETE"
  if (count === ANALYTIC_MAX_RESULTS) return "LIMIT"
  return "COMPLETE"
}
