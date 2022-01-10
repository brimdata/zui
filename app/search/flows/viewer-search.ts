import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "src/js/flows/config"
import {search, SearchResult} from "src/js/flows/search/mod"
import ErrorFactory from "src/js/models/ErrorFactory"
import Columns from "src/js/state/Columns"
import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import SearchBar from "src/js/state/SearchBar"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import Viewer from "src/js/state/Viewer"
import {SchemaMap} from "src/js/state/Viewer/types"
import {zed} from "@brimdata/zealot"
import {SearchResponse} from "../../../src/js/flows/search/response"

type Args = {
  query: string
  from: Date
  to: Date
  keep?: boolean
  append?: boolean
}

const id = "Table"

export function viewerSearch(args: Args): Thunk<Promise<SearchResult>> {
  return (dispatch, getState) => {
    const {query, from, to, keep, append} = args
    const tabId = Tabs.getActive(getState())
    const poolId = Current.mustGetPool(getState()).id
    const {response, promise} = dispatch(
      search({id, query, from, to, poolId, initial: !append})
    )
    dispatch(handle(response, tabId, keep, append))
    return promise.catch((e) => e)
  }
}

function handle(
  response: SearchResponse,
  tabId: string,
  keep = false,
  append = false
): Thunk {
  return function(dispatch, getState) {
    let allColumns: SchemaMap = {}
    let allRecords: zed.Record[] = []
    let count = 0

    // preserve searchKey in case of clear
    const currentSearchKey = Viewer.getSearchKey(getState())
    if (!keep && !append) {
      dispatch(Viewer.clear(tabId))
      dispatch(Viewer.setSearchKey(tabId, currentSearchKey))
    }

    dispatch(Viewer.setStatus(tabId, "FETCHING"))
    dispatch(Viewer.setEndStatus(tabId, "FETCHING"))

    response
      .status((status) => dispatch(Viewer.setStatus(tabId, status)))
      .chan(0, ({rows, schemas}) => {
        count = rows.length

        if (keep) {
          allColumns = schemas
          allRecords = rows
          return
        }

        if (append) {
          dispatch(Viewer.appendRecords(tabId, rows))
        } else {
          dispatch(Viewer.setRecords(tabId, rows))
        }
        dispatch(Viewer.updateColumns(tabId, schemas))
        dispatch(Columns.touch(schemas))
      })
      .warning((warning) => dispatch(SearchBar.errorSearchBarParse(warning)))
      .error((error) => {
        dispatch(Notice.set(ErrorFactory.create(error)))
      })
      .end(() => {
        if (keep) {
          dispatch(Viewer.clear(tabId))
          dispatch(Viewer.setSearchKey(tabId, currentSearchKey))
          dispatch(Viewer.setRecords(tabId, allRecords))
          dispatch(Viewer.setColumns(tabId, allColumns))
          dispatch(Columns.touch(allColumns))
        }
        dispatch(Viewer.setEndStatus(tabId, endStatus(count)))
      })
  }
}

function endStatus(count) {
  if (count === PER_PAGE) return "INCOMPLETE"
  if (count === ANALYTIC_MAX_RESULTS) return "LIMIT"
  return "COMPLETE"
}
