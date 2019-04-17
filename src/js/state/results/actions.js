/* @flow */

import type {RESULTS_CLEAR, RESULTS_RECEIVE} from "./types"
import type {TupleSet} from "../../types"

export function receiveResults(results: TupleSet): RESULTS_RECEIVE {
  return {type: "RESULTS_RECEIVE", results}
}

export function clearResults(): RESULTS_CLEAR {
  return {type: "RESULTS_CLEAR"}
}
