import {ResultStream, zed} from "@brimdata/zealot"
import {
  ChronoField,
  DateTimeFormatterBuilder,
  LocalDateTime,
} from "@js-joda/core"
import {isUndefined} from "lodash"
import brim, {Ts} from "src/js/brim"
import Tabs from "src/js/state/Tabs"
import Current from "../../state/Current"
import Tab from "../../state/Tab"
import {Thunk} from "../../state/types"

type Args = {
  query: string
  from?: Date
  to?: Date
  poolId?: string
  id?: string
  initial?: boolean
}

type annotateArgs = {
  poolId: string
  from?: Date | Ts | bigint
  to?: Date | Ts | bigint
}

export const annotateQuery = (query: string, args: annotateArgs) => {
  // if query already starts with 'from', we do not annotate it further
  if (/^from[\s(]/i.test(query)) return query
  let {
    poolId,
    from = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days
    to = new Date(),
  } = args

  const annotated = [`from '${poolId}'`]

  if (from && to && !isZeroDefaultSpan(from, to)) {
    annotated.push(`ts >= ${dateToNanoTs(from)}`)
    annotated.push(`ts <= ${dateToNanoTs(to)}`)
  }
  annotated.push(query)

  return annotated.join(" | ")
}

const isZeroDefaultSpan = (
  from: Date | Ts | bigint,
  to: Date | Ts | bigint
): boolean => {
  return (
    brim.time(from).toBigInt() === 0n && brim.time(to).toBigInt() === 1000000n
  )
}

export const dateToNanoTs = (date: Date | Ts | bigint): string => {
  const NanoFormat = new DateTimeFormatterBuilder()
    .appendPattern("yyyy-MM-dd'T'HH:mm:ss")
    .appendFraction(ChronoField.NANO_OF_SECOND, 3, 9, true)
    .appendLiteral("Z")
    .toFormatter()

  return LocalDateTime.parse(brim.time(date).format()).format(NanoFormat)
}

export type SearchResult = {
  id: string
  tabId: string
  status: string
  initial: boolean
  shapes: zed.Type[]
}

export function search({
  query,
  from,
  to,
  poolId,
  id,
  initial,
}: Args): Thunk<Promise<ResultStream>> {
  return async (dispatch, getState, {api}) => {
    const tabSpan = Tab.getSpanAsDates(getState())
    const tab = Tabs.getActive(getState())
    const defaultPoolId = Current.getPoolId(getState())
    const zealot = await api.getZealot()
    const ctl = new AbortController()
    const abort = () => ctl.abort()
    const tag = id

    poolId = poolId || defaultPoolId
    from = from || (tabSpan && tabSpan[0])
    to = to || (tabSpan && tabSpan[1])
    initial = isUndefined(initial) ? true : initial
    // Move annotate query into a selector
    const res = await zealot.query(annotateQuery(query, {from, to, poolId}), {
      signal: ctl.signal,
    })
    api.abortables.abort({tab, tag})
    const aId = api.abortables.add({abort, tab, tag})

    res.promise
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        api.abortables.remove(aId)
      })

    return res
  }
}
