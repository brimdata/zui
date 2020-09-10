import {SearchTarget} from "../../state/SearchBar/types"
import {Thunk} from "../../state/types"
import {getZealot} from "../getZealot"
import {handle} from "./handler"
import Handlers from "../../state/Handlers"
import {SearchResponse} from "./response"

type Args = {
  query: string
  from: Date
  to: Date
  spaceId: string
  id: string
  target: SearchTarget
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
  id,
  target
}: Args): Thunk<BrimSearch> {
  return (dispatch) => {
    const zealot = dispatch(getZealot())
    const ctl = new AbortController()
    const searchHandle = {type: "SEARCH", abort: () => ctl.abort()}
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
