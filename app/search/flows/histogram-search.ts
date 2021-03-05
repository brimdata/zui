import Url from "src/js/state/Url"
import {createSearchEntry} from "../../../src/js/brim/searchEntry"
import {search} from "../../../src/js/flows/search/mod"
import {SearchResponse} from "../../../src/js/flows/search/response"
import ErrorFactory from "../../../src/js/models/ErrorFactory"
import chart from "../../../src/js/state/Chart"
import Current from "../../../src/js/state/Current"
import Notice from "../../../src/js/state/Notice"
import Search from "../../../src/js/state/Search"
import Tabs from "../../../src/js/state/Tabs"
import {Thunk} from "../../../src/js/state/types"

type Args = {
  query: string
  from: Date
  to: Date
}

const id = "Histogram"

export function histogramSearch({query, from, to}: Args): Thunk<Promise<void>> {
  return (dispatch, getState) => {
    const state = getState()

    const spaceId = Current.mustGetSpace(state).id
    const {response, promise} = dispatch(search({id, query, from, to, spaceId}))
    dispatch(handle(response))
    return promise
  }
}

function handle(response: SearchResponse): Thunk {
  return function(dispatch, getState) {
    const tabId = Tabs.getActive(getState())
    const current = Search.getRecord(getState())
    const previous = Url.getSearchParams(getState())

    if (shouldClear(current, previous)) dispatch(chart.clear(tabId))
    dispatch(chart.setStatus(tabId, "FETCHING"))

    response
      .status((status) => dispatch(chart.setStatus(tabId, status)))
      .chan(0, (records) => dispatch(chart.appendRecords(tabId, records)))
      .error((error) => dispatch(Notice.set(ErrorFactory.create(error))))
  }
}

function shouldClear(curr, prev) {
  if (!prev) return true

  const a = createSearchEntry(curr)
  const b = createSearchEntry(prev)

  if (
    a.program === b.program &&
    a.spaceId === b.spaceId &&
    a.getDuration() === b.getDuration()
  ) {
    return false
  } else {
    return true
  }
}
