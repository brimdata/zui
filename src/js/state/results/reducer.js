/* @flow */

import type {
  RESULTS_APPEND,
  RESULTS_CLEAR,
  RESULTS_COMPLETE,
  RESULTS_LIMIT,
  RESULTS_SPLICE,
  ResultsState
} from "./types"
import {concat, splice} from "../../lib/Array"

type Action =
  | RESULTS_APPEND
  | RESULTS_CLEAR
  | RESULTS_SPLICE
  | RESULTS_COMPLETE
  | RESULTS_LIMIT

const initState = {
  logs: [],
  completion: "INCOMPLETE"
}

export default function(state: ResultsState = initState, action: Action) {
  switch (action.type) {
    case "RESULTS_APPEND":
      return {...state, logs: concat(state.logs, action.results)}
    case "RESULTS_CLEAR":
      return {...initState}
    case "RESULTS_SPLICE":
      return {...state, logs: splice(state.logs, action.index)}
    case "RESULTS_COMPLETE":
      return {...state, completion: "COMPLETE"}
    case "RESULTS_LIMIT":
      return {...state, completion: "LIMIT"}
    default:
      return state
  }
}
