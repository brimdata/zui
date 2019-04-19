/* @flow */
import {throttle} from "lodash"

import type {BoomPayload} from "../../BoomClient/types"
import type {Dispatch} from "../../state/reducers/types"
import {PER_PAGE} from "../../state/reducers/logViewer"
import type {SearchCallbackMap, SearchTemplate} from "../types"
import {accumResults} from "../../lib/accumResults"
import {appendViewerLogs, setViewerStatus} from "../../state/viewer/actions"
import Log from "../../models/Log"

export default function(
  dispatch: Dispatch,
  _search: SearchTemplate
): SearchCallbackMap {
  let accum = accumResults()

  function dispatchResults() {
    let logs = Log.fromTupleSet(accum.getChannel("0"))
    dispatch(appendViewerLogs(logs))
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
        if (count < PER_PAGE) dispatch(setViewerStatus("COMPLETE"))
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
