import {ResultStream} from "@brimdata/zealot"
import {
  ChronoField,
  DateTimeFormatterBuilder,
  LocalDateTime,
} from "@js-joda/core"
import {isUndefined} from "lodash"
import brim, {Ts} from "src/js/brim"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"
import {getZealot} from "src/js/flows/getZealot"
import {BrimQuery} from "../utils/brim-query"

type Args = {
  query: BrimQuery
  id?: string
  initial?: boolean
}

export const dateToNanoTs = (date: Date | Ts | bigint): string => {
  const NanoFormat = new DateTimeFormatterBuilder()
    .appendPattern("yyyy-MM-dd'T'HH:mm:ss")
    .appendFraction(ChronoField.NANO_OF_SECOND, 3, 9, true)
    .appendLiteral("Z")
    .toFormatter()

  return LocalDateTime.parse(brim.time(date).format()).format(NanoFormat)
}

const search =
  ({query, id, initial}: Args): Thunk<Promise<ResultStream>> =>
  async (dispatch, getState, {api}) => {
    const tab = Tabs.getActive(getState())
    const zealot = await dispatch(getZealot())
    const ctl = new AbortController()
    const abort = () => ctl.abort()
    const tag = id

    initial = isUndefined(initial) ? true : initial
    const res = await zealot.query(query.toString(), {
      signal: ctl.signal,
    })
    api.abortables.abort({tab, tag})
    const aId = api.abortables.add({abort, tab, tag})

    res.promise
      .then(() => {
        api.searches.emit("did-finish", {
          tabId: tab,
          status: res.status,
          shapes: res.shapes,
          id,
          initial,
        })
      })
      .catch((e) => {
        console.error(e)
      })
      .finally(() => {
        api.abortables.remove(aId)
      })

    return res
  }
export default search
