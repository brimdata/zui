/* @flow */
import type {BoomPayload} from "../BoomClient/types"
import type {Dispatch} from "../state/reducers/types"
import {PER_PAGE} from "../state/reducers/logViewer"
import {accumTupleSet} from "../lib/accumResults"
import {appendResults, resultsComplete} from "../state/results/actions"
import Log from "../models/Log"
import throttle from "lodash/throttle"

export function resultsHandlers(dispatch: Dispatch) {
  let count = 0
  let accum = accumTupleSet()

  function dispatchNow() {
    let logs = Log.fromTupleSet(accum.getTupleSet())
    if (logs.length) dispatch(appendResults(logs))
    accum.clearTuples()
  }

  let dispatchSteady = throttle(dispatchNow, 100, {leading: false})

  function each(payload: BoomPayload) {
    switch (payload.type) {
      case "SearchDescriptors":
        accum.addDescriptors(payload.descriptors)
        break
      case "SearchTuples":
        accum.addTuples(payload.tuples)
        count += payload.tuples.length
        dispatchSteady()
        break
      case "SearchEnd":
        dispatchSteady.cancel()
        dispatchNow()
        if (count < PER_PAGE) dispatch(resultsComplete())
        break
    }
  }

  function abort() {
    dispatchSteady.cancel()
  }

  return {each, abort}
}
