/* @flow */
import type {BoomPayload} from "../BoomClient/types"
import type {Dispatch} from "../state/types"
import type {SearchCallbackMap} from "./types"
import {accumResults} from "../lib/accumResults"
import {updateFinding} from "../state/actions"
import Log from "../models/Log"

export default function(dispatch: Dispatch): SearchCallbackMap {
  let accum = accumResults()

  function each(payload: BoomPayload) {
    switch (payload.type) {
      case "SearchDescriptors":
        accum.addDescriptors(payload.descriptors)
        break
      case "SearchTuples":
        accum.addTuples(payload.tuples)
        break
    }

    function sumCounts(count, log) {
      return (count += log.cast("count"))
    }

    let logs = Log.fromTupleSet(accum.getChannel("0"))
    let resultCount = logs.reduce(sumCounts, 0)

    dispatch(updateFinding({resultCount}))
  }

  return {each}
}
