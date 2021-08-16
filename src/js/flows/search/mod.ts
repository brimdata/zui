import Tabs from "src/js/state/Tabs"
import {Thunk} from "../../state/types"
import {getZealot} from "../getZealot"
import {handle} from "./handler"
import {SearchResponse} from "./response"
import Current from "../../state/Current"
import Tab from "../../state/Tab"
import brim, {Ts} from "src/js/brim"
import {
  ChronoField,
  DateTimeFormatterBuilder,
  LocalDateTime
} from "@js-joda/core"

type Args = {
  query: string
  from?: Date
  to?: Date
  poolId?: string
  id?: string
}

type annotateArgs = {
  poolId: string
  from?: Date | Ts | bigint
  to?: Date | Ts | bigint
}

export const annotateQuery = (query: string, args: annotateArgs) => {
  const {
    poolId,
    from = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days
    to = new Date()
  } = args
  const fromTs = dateToNanoTs(from)
  const toTs = dateToNanoTs(to)
  return `from '${poolId}' | ts >= ${fromTs} | ts <= ${toTs} | ${query}`
}

const dateToNanoTs = (date: Date | Ts | bigint): string => {
  const NanoFormat = new DateTimeFormatterBuilder()
    .appendPattern("yyyy-MM-dd'T'HH:mm:ss")
    .appendFraction(ChronoField.NANO_OF_SECOND, 0, 9, true)
    .appendLiteral("Z")
    .toFormatter()

  return LocalDateTime.parse(brim.time(date).format()).format(NanoFormat)
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
    const req = zealot.query(annotateQuery(query, {from, to, poolId}), {
      signal: ctl.signal
    })

    api.abortables.abort({tab, tag})
    const aId = api.abortables.add({abort, tab, tag})

    const {response, promise} = handle(req)
    promise.finally(() => api.abortables.remove(aId))

    return {response, promise, abort}
  }
}
