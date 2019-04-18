/* @flow */

import type {
  RESULTS_APPEND,
  RESULTS_CLEAR,
  RESULTS_COMPLETE,
  RESULTS_LIMIT,
  RESULTS_SPLICE
} from "./types"
import Log from "../../models/Log"

export function appendResults(results: Log[]): RESULTS_APPEND {
  return {type: "RESULTS_APPEND", results}
}

export function clearResults(): RESULTS_CLEAR {
  return {type: "RESULTS_CLEAR"}
}

export function spliceResults(index: number): RESULTS_SPLICE {
  return {type: "RESULTS_SPLICE", index}
}

export function resultsComplete(): RESULTS_COMPLETE {
  return {type: "RESULTS_COMPLETE"}
}

export function resultsLimit(): RESULTS_LIMIT {
  return {type: "RESULTS_LIMIT"}
}
