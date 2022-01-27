import brim from "src/js/brim"
import {search} from "src/js/flows/search/mod"
import ErrorFactory from "src/js/models/ErrorFactory"
import {addEveryCountProc} from "src/js/searches/histogramSearch"
import Chart from "src/js/state/Chart"
import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import Url from "src/js/state/Url"

const id = "Histogram"

export function histogramSearch(): Thunk<void> {
  return (dispatch, getState) => {
    const state = getState()
    const {program, pins} = Url.getSearchParams(state)
    const span = Url.getSpanParamsWithDefaults(state)
    const from = brim.time(span[0]).toDate()
    const to = brim.time(span[1]).toDate()
    const brimProgram = brim.program(program, pins)
    const query = addEveryCountProc(brimProgram.string(), [from, to])
    const poolId = Current.mustGetPool(state).id

    const tabId = Tabs.getActive(getState())
    const history = global.tabHistories.get(tabId)
    const {key} = history.location
    dispatch(Chart.setSearchKey(tabId, key))

    return dispatch(search({id, query, from, to, poolId}))
    // dispatch(handle(response))
    // return promise.catch((e) => e)
  }
}

// function handle(response: SearchResponse): Thunk {
//   return function(dispatch, getState) {
//     const tabId = Tabs.getActive(getState())
//     const params = Url.getSearchParams(getState())

//     if (!params.keep) {
//       const currentSearchKey = Chart.getSearchKey(getState())
//       dispatch(Chart.clear(tabId))
//       dispatch(Chart.setSearchKey(tabId, currentSearchKey))
//     }
//     dispatch(Chart.setStatus(tabId, "FETCHING"))

//     response
//       .status((status) => dispatch(Chart.setStatus(tabId, status)))
//       .chan(0, ({rows}) => dispatch(Chart.appendRecords(tabId, rows)))
//       .error((error) => dispatch(Notice.set(ErrorFactory.create(error))))
//   }
// }
