import {
  getAllStates,
  getAllTabs_before_202307101053,
} from "src/js/state/migrations/utils/getTestState"
import {parsePath} from "history"

const poolSearchPath = (spaceId, workspaceId, params) =>
  `/workspaces/${workspaceId}/lakes/${spaceId}/search?${encodeSearchParams(
    params
  )}`

// copied from source at time of migration
const encodeSearchParams = ({program, pins, spanArgs}: any) => {
  const p = new URLSearchParams()
  if (program) p.append("q", program)
  encodeSpan(p, spanArgs, "from", "to")
  encodePins(p, pins || [])
  return p.toString()
}
const encodeSpan = (params, span, from, to) => {
  if (span && span[0]) params.append(from, encodeSpanArg(span[0]))
  if (span && span[1]) params.append(to, encodeSpanArg(span[1]))
}
const encodeSpanArg = (arg) => {
  return typeof arg === "string" ? arg : `${arg.sec}.${arg.ns}`
}
const encodePins = (params, pins) => {
  for (let i = 0; i < pins.length; ++i) {
    params.append(pinKey(i), pins[i])
  }
}
const pinKey = (i) => `p${i}`

/**
 * We never stored the workspace id in the search records. This was probably
 * because it was only ever localhost:9867. So we'll have to assume for sake
 * of this migration that all the search records are in localhost:9867.
 */
const toUrl = (e) => parsePath(poolSearchPath(e.spaceId, "localhost:9867", e))

export default function convertHistoryToUrls(state: any) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue

    /**
     * Move all tab histories into their url format
     */
    const tabHistories = s.tabs.data.map((tab) => ({
      id: tab.id,
      index: tab.history.position,
      entries: tab.history.entries.map(toUrl),
    }))
    const ids = tabHistories.map((e) => e.id)
    const entities = tabHistories.reduce((a, e) => ({...a, [e.id]: e}), {})
    s.tabHistories = {ids, entities} // The Entity Adapter format
  }

  /**
   * Delete tab.history, current, and last
   */
  for (const tab of getAllTabs_before_202307101053(state)) {
    delete tab.history
    delete tab.current
    delete tab.last
  }

  return state
}
