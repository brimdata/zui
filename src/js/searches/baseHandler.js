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
import ErrorFactory from "../models/ErrorFactory"
import brim from "../brim"
import notice from "../state/notice"

export default function(
  dispatch: Dispatch,
  search: SearchTemplate
): SearchCallbackMap {
  let name = search.name
  let accum = accumResults()
  let collector = brim.recordCollector()

  function dispatchResults() {
    if (accum.noTuples()) return

    dispatch(appendSearchResults(name, accum.getResults()))
    accum.clearTuples()
  }

  let dispatchResultsSteady = throttle(dispatchResults, 100, {leading: false})

  function each(payload: BoomPayload) {
    switch (payload.type) {
      case "SearchRecords":
        var chanId = payload.channel_id.toString()
        collector.add(chanId, payload.records)
        break
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
            currentTs: brim.time(payload.current_ts).toFracSec(),
            startTime: brim.time(payload.start_time).toFracSec(),
            updateTime: brim.time(payload.update_time).toFracSec(),
            bytesMatched: payload.bytes_matched,
            bytesRead: payload.bytes_read,
            tuplesMatched: payload.records_matched,
            tuplesRead: payload.records_read
          })
        )
        break
      case "SearchEnd":
        collector.records()
        dispatchResultsSteady.cancel()
        dispatchResults()
        dispatch(setSearchStatus(name, "SUCCESS"))
        break
      case "TaskEnd":
        if (payload.error) {
          dispatch(setSearchStatus(name, "ERROR"))
          dispatch(notice.set(ErrorFactory.create(payload.error)))
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
