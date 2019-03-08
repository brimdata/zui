/* @flow */

import type {Tuple} from "../types"

export const clearLogs = () => ({
  type: "LOGS_CLEAR"
})

export const receiveLogTuples = (tuples: Tuple[]) => ({
  type: "LOGS_RECEIVE",
  tuples
})
