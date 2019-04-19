/* @flow */
import {throttle} from "lodash"

import type {BoomPayload} from "../../BoomClient/types"
import type {Dispatch} from "../../state/reducers/types"
import type {SearchCallbackMap, SearchTemplate} from "../types"
import {accumResults} from "../../lib/accumResults"
import {
  appendSearchResults,
  setSearchStats,
  setSearchStatus
} from "../../state/searches/actions"
import {boomTime} from "../../lib/Time"

export default function(
  dispatch: Dispatch,
  search: SearchTemplate
): SearchCallbackMap {
  let name = search.name
  let accum = accumResults()

  function dispatchResults() {
    if (accum.noTuples()) return

    dispatch(appendSearchResults(name, accum.getResults()))
    accum.clearTuples()
  }

  let dispatchResultsSteady = throttle(dispatchResults, 100, {leading: false})

  function each(payload: BoomPayload) {
    switch (payload.type) {
      case "SearchDescriptors":
        accum.addDescriptors(payload.descriptors)
        break
      case "SearchTuples":
        accum.addTuples(payload.tuples)
        dispatchResultsSteady()
        break
      case "SearchStats":
        dispatch(
          setSearchStats(name, {
            startTime: boomTime(payload.start_time),
            updateTime: boomTime(payload.update_time),
            bytesMatched: payload.stats.bytes_matched,
            bytesRead: payload.stats.bytes_read,
            tuplesMatched: payload.stats.tuples_matched,
            tuplesRead: payload.stats.tuples_read
          })
        )
        break
      case "SearchEnd":
        dispatchResultsSteady.cancel()
        dispatchResults()
        dispatch(setSearchStatus(name, "SUCCESS"))
        break
    }
  }

  function abort() {
    dispatch(setSearchStatus(name, "ERROR"))
    dispatchResultsSteady.cancel()
    dispatchResults()
  }

  function error() {
    dispatch(setSearchStatus(name, "ABORTED"))
    dispatchResultsSteady.cancel()
    dispatchResults()
  }

  return {
    each,
    error,
    abort
  }
}
