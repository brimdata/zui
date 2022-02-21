import {zed} from "@brimdata/zealot"
import brim from "src/js/brim"
import {search} from "src/js/flows/search/mod"
import ErrorFactory from "src/js/models/ErrorFactory"
import {addEveryCountProc} from "src/js/searches/histogramSearch"
import Chart from "src/js/state/Chart"
import Current from "src/js/state/Current"
import Notice from "src/js/state/Notice"
import Tab from "src/js/state/Tab"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import Url from "src/js/state/Url"

const id = "Histogram"

export function histogramSearch(): Thunk<Promise<void>> {
  return async (dispatch, getState) => {
    const state = getState()
    const {program, pins} = Url.getSearchParams(state)
    const span = Tab.getSpan(state)
    if (!span) return
    const from = brim.time(span[0]).toDate()
    const to = brim.time(span[1]).toDate()
    const brimProgram = brim.program(program, pins)
    const query = addEveryCountProc(brimProgram.string(), [from, to])
    const poolId = Current.mustGetPool(state).id

    const tabId = Tabs.getActive(getState())
    const history = global.tabHistories.get(tabId)
    const {key} = history.location
    dispatch(Chart.clear(tabId))
    dispatch(Chart.setSearchKey(tabId, key))
    dispatch(Chart.setStatus(tabId, "FETCHING"))

    const resp = await dispatch(search({id, query, from, to, poolId}))
    try {
      await resp.collect(({rows}) => {
        dispatch(Chart.setRecords(tabId, rows as zed.Record[]))
      })
      dispatch(Chart.setStatus(tabId, "SUCCESS"))
    } catch (e) {
      dispatch(Notice.set(ErrorFactory.create(e)))
      dispatch(Chart.setStatus(tabId, "ERROR"))
    }
  }
}
