/* @flow */
import {throttle} from "lodash"

import type {BoomPayload} from "../BoomClient/types"
import type {Dispatch} from "../state/types"
import type {SearchCallbackMap, SearchTemplate} from "./types"
import {accumResults} from "../lib/accumResults"
import {
  appendSearchResults,
  setSearchStats,
  setSearchStatus
} from "../state/searches/actions"
import {boomTime} from "../lib/Time"
import {setBackendError} from "../backend"
import ErrorFactory from "../models/ErrorFactory"

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
        accum.addTuples(payload.tuples, payload.channel_id.toString())
        dispatchResultsSteady()
        break
      case "SearchStats":
        dispatch(
          setSearchStats(name, {
            currentTs: boomTime(payload.current_ts),
            startTime: boomTime(payload.start_time),
            updateTime: boomTime(payload.update_time),
            bytesMatched: payload.bytes_matched,
            bytesRead: payload.bytes_read,
            tuplesMatched: payload.records_matched,
            tuplesRead: payload.records_read
          })
        )
        break
      case "SearchEnd":
        dispatchResultsSteady.cancel()
        dispatchResults()
        dispatch(setSearchStatus(name, "SUCCESS"))
        break
      case "TaskEnd":
        if (payload.error) {
          dispatch(setSearchStatus(name, "ERROR"))
          dispatch(setBackendError(ErrorFactory.create(payload.error)))
          dispatchResultsSteady.cancel()
          dispatchResults()
          break
        }
    }
  }

  function abort() {
    dispatch(setSearchStatus(name, "ABORTED"))
    dispatchResultsSteady.cancel()
    dispatchResults()
  }

  function error() {
    dispatch(setSearchStatus(name, "ERROR"))
    dispatchResultsSteady.cancel()
    dispatchResults()
  }

  return {
    each,
    error,
    abort
  }
}
