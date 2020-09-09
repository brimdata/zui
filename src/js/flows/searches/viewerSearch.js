/* @flow */

import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "../config"
import type {SearchTarget} from "../../state/SearchBar/types"
import type {Thunk} from "../../state/types"
import {hashDescriptorKeys} from "../../state/Viewer/helpers/hashDescriptorKeys"
import {search} from "../search/mod"
import Columns from "../../state/Columns"
import Current from "../../state/Current"
import ErrorFactory from "../../models/ErrorFactory"
import Notice from "../../state/Notice"
import SearchBar from "../../state/SearchBar"
import Tabs from "../../state/Tabs"
import Viewer from "../../state/Viewer"

type Args = {
  query: string,
  from: Date,
  to: Date,
  target: SearchTarget,
  isBlocking?: boolean,
  append?: boolean
}

const id = "Table"

export function viewerSearch(args: Args): Thunk {
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
  response: *,
  tabId: string,
  isBlocking?: boolean = false,
  append?: boolean = false
): Thunk {
  return function(dispatch) {
    const collectedColumns = {}
    let collectedRecords = []

    if (!append && !isBlocking) {
      dispatch(Viewer.clear(tabId))
    }

    dispatch(Viewer.setStatus(tabId, "FETCHING"))
    dispatch(Viewer.setEndStatus(tabId, "FETCHING"))

    response
      .status((status) => dispatch(Viewer.setStatus(tabId, status)))
      .chan(0, (records, types) => {
        const columns = hashDescriptorKeys(types)

        if (isBlocking) {
          Object.assign(collectedColumns, columns)
          collectedRecords = collectedRecords.concat(records)
          return
        }

        dispatch(Viewer.appendRecords(tabId, records))
        dispatch(Viewer.updateColumns(tabId, columns))
        dispatch(Columns.touch(columns))
      })
      .warnings((warning) => dispatch(SearchBar.errorSearchBarParse(warning)))
      .error((error) => {
        dispatch(Notice.set(ErrorFactory.create(error)))
      })
      .end((_id, count) => {
        if (isBlocking) {
          dispatch(Viewer.setRecords(tabId, collectedRecords))
          dispatch(Viewer.setColumns(tabId, collectedColumns))
          dispatch(Columns.touch(collectedColumns))
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
