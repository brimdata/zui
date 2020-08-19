/* @flow */
import type {Thunk} from "../state/types"
import Handlers from "../state/Handlers"
import brim, {type $Search} from "../brim"
import whenIdle from "../lib/whenIdle"
import Current from "../state/Current"

function abortError(e) {
  return /user aborted/i.test(e.message)
}

export default function executeSearch(search: $Search): Thunk {
  return function(dispatch, getState, {createZealot}) {
    const zealot = createZealot(Current.getConnectionId(getState()))
    let buffer = brim.flatRecordsBuffer()
    let count = 0

    function flushBuffer() {
      for (let chan of buffer.channels()) {
        if (!chan.empty()) {
          search.emit(chan.id(), chan.records(), buffer.columns())
          chan.clear()
        }
      }
    }

    let flushBufferLazy = whenIdle(flushBuffer)

    function started({task_id}) {
      search.emit("start", task_id)
      search.emit("status", "FETCHING")
    }

    function records(payload) {
      count += payload.records.length
      buffer.add(payload.channel_id, payload.records)
      flushBufferLazy()
    }

    function errored(e) {
      flushBufferLazy.cancel()
      search.emit("status", "ERROR")
      if (abortError(e)) {
        search.emit("abort")
      } else {
        search.emit("error", e)
      }
    }

    function ended({id, error}) {
      if (error) {
        errored(error)
      } else {
        flushBuffer()
        search.emit("status", "SUCCESS")
        search.emit("end", id, count)
      }
      dispatch(Handlers.remove(search.getId()))
    }

    function warnings(payload) {
      search.emit("warnings", payload.warnings)
    }

    dispatch(Handlers.abort(search.getId(), false))
    const ctl = new AbortController()
    zealot
      .search(search.program, {
        from: search.span[0],
        to: search.span[1],
        spaceId: search.spaceId,
        signal: ctl.signal
      })
      .then((stream) => {
        stream
          .callbacks()
          .start(started)
          .records(records)
          .end(ended)
          .warnings(warnings)
          .error(errored)
      })
      .catch(errored)

    dispatch(
      Handlers.register(search.getId(), {
        type: "SEARCH",
        abort: () => ctl.abort()
      })
    )

    return () => ctl.abort()
  }
}
