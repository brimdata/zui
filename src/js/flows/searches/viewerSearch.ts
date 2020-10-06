import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "../config"
import {SearchTarget} from "../../state/SearchBar/types"
import {Thunk} from "../../state/types"
import {search} from "../search/mod"
import Columns from "../../state/Columns"
import Current from "../../state/Current"
import ErrorFactory from "../../models/ErrorFactory"
import Notice from "../../state/Notice"
import SearchBar from "../../state/SearchBar"
import Tabs from "../../state/Tabs"
import Viewer from "../../state/Viewer"
import {zng} from "zealot"
import md5 from "md5"
import {SearchResponse} from "../search/response"

type Args = {
  query: string
  from: Date
  to: Date
  target: SearchTarget
  isBlocking?: boolean
  append?: boolean
}

const id = "Table"

export function viewerSearch(args: Args): Thunk<Promise<void>> {
  return (dispatch, getState) => {
    const {query, from, to, target, isBlocking, append} = args
    const tabId = Tabs.getActive(getState())
    const spaceId = Current.mustGetSpace(getState()).id
    const {response, promise} = dispatch(
      search({id, query, from, to, spaceId, target})
    )
    dispatch(handle(response, tabId, isBlocking, append))
    return promise
  }
}

function handle(
  response: SearchResponse,
  tabId: string,
  isBlocking = false,
  append = false
): Thunk {
  return function(dispatch) {
    let allColumns = {}
    let allRecords = []

    if (!append && !isBlocking) {
      dispatch(Viewer.clear(tabId))
    }

    dispatch(Viewer.setStatus(tabId, "FETCHING"))
    dispatch(Viewer.setEndStatus(tabId, "FETCHING"))

    response
      .status((status) => dispatch(Viewer.setStatus(tabId, status)))
      .chan(0, (records, schemas: Map<number, zng.Schema>) => {
        const columns = {}
        for (let schema of schemas.values()) {
          const hash = md5(JSON.stringify(schema.columns))
          columns[hash] = schema
        }

        if (isBlocking) {
          allColumns = columns
          allRecords = records
          return
        }

        dispatch(Viewer.setRecords(tabId, records))
        dispatch(Viewer.updateColumns(tabId, columns))
        dispatch(Columns.touch(columns))
      })
      .warnings((warning) => dispatch(SearchBar.errorSearchBarParse(warning)))
      .error((error) => {
        dispatch(Notice.set(ErrorFactory.create(error)))
      })
      .end((_id, count) => {
        if (isBlocking) {
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
