import Tabs from "src/js/state/Tabs"
import Current from "../../state/Current"
import Tab from "../../state/Tab"
import {Thunk} from "../../state/types"
import {getZealot} from "../getZealot"
import {handle} from "./handler"
import {SearchResponse} from "./response"

type Args = {
  query: string
  from?: Date
  to?: Date
  poolId?: string
  id?: string
}

export type BrimSearch = {
  response: SearchResponse
  promise: Promise<void>
  abort: () => void
}

export function search({query, from, to, poolId, id}: Args): Thunk<BrimSearch> {
  return (dispatch, getState, {api}) => {
    const [defaultFrom, defaultTo] = Tab.getSpanAsDates(getState())
    const tab = Tabs.getActive(getState())
    const defaultPoolId = Current.getPoolId(getState())
    const zealot = dispatch(getZealot())
    const ctl = new AbortController()
    const abort = () => ctl.abort()
    const tag = id

    poolId = poolId || defaultPoolId
    to = to || defaultTo
    from = from || defaultFrom
    const req = zealot.search(query, {from, to, poolId, signal: ctl.signal})

    api.abortables.abort({tab, tag})
    const aId = api.abortables.add({abort, tab, tag})

    const {response, promise} = handle(req)
    promise.finally(() => api.abortables.remove(aId))

    return {response, promise, abort}
  }
}
