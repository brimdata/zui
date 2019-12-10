/* @flow */
import {throttle} from "lodash"

import {ANALYTIC_MAX_RESULTS, PER_PAGE} from "./config"
import type {BoomPayload} from "../services/BoomClient/types"
import type {Dispatch} from "../state/types"
import type {SearchCallbackMap, SearchTemplate} from "../searches/types"
import {accumResults} from "../lib/accumResults"
import {
  appendViewerLogs,
  setViewerStatus,
  updateViewerColumns
} from "../state/viewer/actions"
import Log from "../models/Log"

export default function(
  dispatch: Dispatch,
  _search: SearchTemplate
): SearchCallbackMap {
  let accum = accumResults()

  function dispatchResults() {
    let tupleSet = accum.getChannel("0")
    let logs = Log.fromTupleSet(tupleSet)
    dispatch(appendViewerLogs(logs))
    dispatch(updateViewerColumns(tupleSet.descriptors))
    accum.clearTuples()
  }

  let dispatchResultsSteady = throttle(dispatchResults, 100, {leading: false})
  let count = 0
  function each(payload: BoomPayload) {
    switch (payload.type) {
      case "SearchDescriptors":
        accum.addDescriptors(payload.descriptors)
        break
      case "SearchTuples":
        accum.addTuples(payload.tuples)
        count += payload.tuples.length
        dispatchResultsSteady()
        break
      case "SearchEnd":
        dispatchResultsSteady.cancel()
        dispatchResults()

        if (count === PER_PAGE) {
          dispatch(setViewerStatus("INCOMPLETE"))
        } else if (count === ANALYTIC_MAX_RESULTS) {
          dispatch(setViewerStatus("LIMIT"))
        } else {
          dispatch(setViewerStatus("COMPLETE"))
        }
        break
    }
  }

  function abort() {
    dispatchResultsSteady.cancel()
  }

  function error() {
    dispatchResultsSteady.cancel()
  }

  return {
    each,
    error,
    abort
  }
}
