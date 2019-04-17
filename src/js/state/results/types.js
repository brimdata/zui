/* @flow */

import type {TupleSet} from "../../types"

export type ResultsState = TupleSet

export type RESULTS_RECEIVE = {
  type: "RESULTS_RECEIVE",
  results: TupleSet
}

export type RESULTS_CLEAR = {
  type: "RESULTS_CLEAR"
}
