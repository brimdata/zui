/* @flow */
import type {Thunk} from "../state/types"
import brim, {type $Search} from "../brim"
import handlers from "../state/handlers"
import whenIdle from "../lib/whenIdle"

export default function executeSearch(search: $Search): Thunk {
  return function(dispatch, getState, boom) {
    let buffer = brim.flatRecordsBuffer()

    function flushBuffer() {
      if (buffer.empty()) return
      search.emit("chunk", buffer.records(), buffer.columns())
      buffer.clearRecords()
    }

    let flushBufferLazy = whenIdle(flushBuffer)

    function started(id) {
      search.emit("start", id)
      search.emit("status", "FETCHING")
    }

    function stats(payload) {
      search.emit("stats", payload)
    }

    function records(payload) {
      buffer.add(payload.channel_id.toString(), payload.records)
      flushBufferLazy()
    }

    function aborted() {
      flushBufferLazy.cancel()
      search.emit("status", "ABORT")
    }

    function errored(e) {
      flushBufferLazy.cancel()
      search.emit("status", "ERROR")
      search.emit("error", e)
    }

    function ended({id, error}) {
      if (error) {
        errored(error)
      } else {
        flushBuffer()
        search.emit("status", "SUCCESS")
        search.emit("end", id)
      }
      dispatch(handlers.remove(search.getId()))
    }

    function streamed(payload) {
      switch (payload.type) {
        case "TaskStart":
          return started(payload.task_id)
        case "SearchRecords":
          return records(payload)
        case "SearchStats":
          return stats(payload)
        case "TaskEnd":
          return ended(payload)
      }
    }

    dispatch(handlers.abort(search.getId()))

    let handler = boom
      .search(search.program, {
        searchSpan: search.span,
        searchSpace: search.space
      })
      .onAbort(aborted)
      .error(errored)
      .stream(streamed)

    dispatch(handlers.register(search.getId(), handler))
    return handler
  }
}
