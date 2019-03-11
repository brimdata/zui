/* @flow */

import type {Dispatch} from "../reducers/types"
import type {Payload} from "./types"
import {setBoomSearchStats} from "../actions/boomSearches"

function boomTime({sec, ns}) {
  let flt = sec + ns / 1e9
  return flt
}

export default (name: string, dispatch: Dispatch) => (payload: Payload) => {
  if (payload.type === "SearchStats") {
    const startTime = boomTime(payload.start_time)
    const updateTime = boomTime(payload.update_time)
    dispatch(
      setBoomSearchStats(name, {
        startTime,
        updateTime,
        bytesMatched: payload.stats.bytes_matched,
        bytesRead: payload.stats.bytes_read,
        tuplesMatched: payload.stats.tuples_matched,
        tuplesRead: payload.stats.tuples_read
      })
    )
  }
}
