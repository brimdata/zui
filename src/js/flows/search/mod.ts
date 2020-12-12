import {SearchTarget} from "../../state/SearchBar/types"
import {Thunk} from "../../state/types"
import {getZealot} from "../getZealot"
import {handle} from "./handler"
import Handlers from "../../state/Handlers"
import {SearchResponse} from "./response"
import {Handler} from "src/js/state/Handlers/types"
import Current from "../../state/Current"
import Tab from "../../state/Tab"
import randomHash from "../../brim/randomHash"

type Args = {
  query: string
  from?: Date
  to?: Date
  spaceId?: string
  id?: string
  target?: SearchTarget
}

export type BrimSearch = {
  response: SearchResponse
  promise: Promise<void>
  abort: () => void
}

export function search({
  query,
  from,
  to,
  spaceId,
  id = randomHash(),
  target = "events"
}: Args): Thunk<BrimSearch> {
  return (dispatch, getState) => {
    const [defaultFrom, defaultTo] = Tab.getSpanAsDates(getState())
    const defaultSpaceId = Current.getSpaceId(getState())
    const zealot = dispatch(getZealot())
    const ctl = new AbortController()
    const searchHandle: Handler = {type: "SEARCH", abort: () => ctl.abort()}
    spaceId = spaceId || defaultSpaceId
    to = to || defaultTo
    from = from || defaultFrom
    const req =
      target === "index"
        ? zealot.archive.search({
            patterns: [query],
            spaceId,
            signal: ctl.signal
          })
        : zealot.search(query, {from, to, spaceId, signal: ctl.signal})

    dispatch(Handlers.abort(id, false))
    dispatch(Handlers.register(id, searchHandle))

    const abort = () => ctl.abort()
    const {response, promise} = handle(req)
    promise.finally(() => dispatch(Handlers.remove(id)))
    return {response, promise, abort}
  }
}
