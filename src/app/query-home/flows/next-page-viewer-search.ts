import {isEmpty} from "lodash"
import brim from "src/js/brim"
import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "src/js/flows/config"
import {indexOfLastChange} from "src/js/lib/Array"
import {DateTuple} from "src/js/lib/TimeWindow"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import Viewer from "src/js/state/Viewer"
import {zed} from "@brimdata/zealot"
import {viewerSearch} from "./viewer-search"
import Current from "src/js/state/Current"

/**
 * Called for the infinite scroll behavior in the viewer
 */
export const nextPageViewerSearch = (): Thunk => (dispatch, getState) => {
  const query = Current.getQuery(getState())
  if (!query) return

  if (!query.hasHeadFilter()) {
    query.head = query.hasAnalytics() ? ANALYTIC_MAX_RESULTS : PER_PAGE
  }

  const currentPool = Current.getQueryPool(getState())
  if (!currentPool) return
  const origSpan = brim.span(currentPool.everythingSpan()).toDateTuple()
  const logs = Viewer.getLogs(getState())
  const tabId = Tabs.getActive(getState())
  const [spliceIndex, span] = nextPageArgs(logs, origSpan)
  const [_from, _to] = span

  // INFINITE SCROLL IS BROKEN AND NEEDS TO BE FIXED IN A SUBSEQUENT PR
  const append = true

  dispatch(Viewer.splice(tabId, spliceIndex))
  return dispatch(viewerSearch({query, append}))
}

function nextPageArgs(
  logs: zed.Record[],
  span: DateTuple
): [number, DateTuple] {
  let spliceIndex = 0
  const nextSpan: DateTuple = [...span]
  if (!isEmpty(logs)) {
    const index = indexOfLastChange(logs, (log) => log.try("ts")?.toString())
    if (index >= 0) {
      const ts = logs[index].try<zed.Time>("ts")
      if (ts instanceof zed.Time) {
        const prevTs = ts.toDate()
        nextSpan[1] = brim.time(prevTs).add(1, "ms").toDate()
        spliceIndex = index
      }
    }
  }
  return [spliceIndex, nextSpan]
}

export default nextPageViewerSearch
