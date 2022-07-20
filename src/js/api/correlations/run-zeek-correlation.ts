import Current from "src/js/state/Current"
import Results from "src/js/state/Results"
import {Thunk} from "src/js/state/types"
import {run} from "./run"
import {communityConnFilter, uidFilter} from "./zeek-queries"
import {findCommunityConnArgs, findUid} from "./zeek-util"

export const ZEEK_CORRELATION = "zui/zeek-correlation"
const id = ZEEK_CORRELATION

export const runZeekCorrelation =
  (): Thunk =>
  async (dispatch, getState, {api}) => {
    const tabId = api.current.tabId
    const key = Current.getLocation(getState()).key
    const value = api.results.selectedValue
    const pool = Current.getQuery(getState()).getPoolName()

    const uid = findUid(value)
    if (uid) {
      const query = `from "${pool}" | ${uidFilter(uid)}`
      await dispatch(run(query, {id, tabId, key}))
      const results = Results.getValues(id)(getState())
      const conn = results.find(findCommunityConnArgs)
      if (conn) {
        const data = findCommunityConnArgs(conn)
        const query = `from "${pool}" | ${communityConnFilter(data)}`
        await dispatch(run(query, {id, tabId, key}))
      }
    }
  }
