/* @flow */

import Log from "../../models/Log"

export type ResultsState = {|
  logs: Log[],
  completion: "INCOMPLETE" | "COMPLETE" | "LIMIT"
|}

export type RESULTS_APPEND = {
  type: "RESULTS_APPEND",
  results: Log[]
}

export type RESULTS_CLEAR = {
  type: "RESULTS_CLEAR"
}

export type RESULTS_SPLICE = {
  type: "RESULTS_SPLICE",
  index: number
}

export type RESULTS_COMPLETE = {
  type: "RESULTS_COMPLETE"
}

export type RESULTS_LIMIT = {
  type: "RESULTS_LIMIT"
}
