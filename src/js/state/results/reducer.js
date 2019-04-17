/* @flow */

import type {RESULTS_CLEAR, RESULTS_RECEIVE, ResultsState} from "./types"

type Action = RESULTS_RECEIVE | RESULTS_CLEAR

const initState = {
  tuples: [],
  descriptors: {}
}

export default function(state: ResultsState = initState, action: Action) {
  switch (action.type) {
    case "RESULTS_RECEIVE":
      return action.results
    case "RESULTS_CLEAR":
      return {...initState}
    default:
      return state
  }
}
