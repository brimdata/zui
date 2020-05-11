/* @flow */
import type {Thunk} from "../state/types"
import Boomd from "../state/Boomd"
import Handlers from "../state/Handlers"
import brim, {type $Search} from "../brim"
import whenIdle from "../lib/whenIdle"

export default function executeSearch(search: $Search): Thunk {
  return function(dispatch, getState, boom) {
    boom.setOptions(Boomd.getOptions(getState()))

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

    function started(id) {
      search.emit("start", id)
      search.emit("status", "FETCHING")
    }

    function stats(payload) {
      search.emit("stats", transformStats(payload))
    }

    function records(payload) {
      count += payload.records.length
      buffer.add(payload.channel_id, payload.records)
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
        search.emit("end", id, count)
      }
      dispatch(Handlers.remove(search.getId()))
    }

    function warnings(payload) {
      search.emit("warnings", payload.warnings)
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
        case "SearchWarnings":
          return warnings(payload)
      }
    }

    dispatch(Handlers.abort(search.getId(), false))
    let boomRequest = boom
      .search(search.program, {
        searchSpan: search.span,
        searchSpaceID: search.spaceID
      })
      .onAbort(aborted)
      .error(errored)
      .stream(streamed)

    let handler = {
      type: "SEARCH",
      abort: (emit: boolean = true) => boomRequest.abort(emit)
    }

    dispatch(Handlers.register(search.getId(), handler))
    return () => handler.abort(false)
  }
}

function transformStats(payload) {
  return {
    currentTs: brim.time(payload.current_ts).toFracSec(),
    startTime: brim.time(payload.start_time).toFracSec(),
    updateTime: brim.time(payload.update_time).toFracSec(),
    bytesMatched: payload.bytes_matched,
    bytesRead: payload.bytes_read,
    tuplesMatched: payload.records_matched,
    tuplesRead: payload.records_read
  }
}
