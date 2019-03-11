/* @flow */

import type {Tuple} from "../types"

export const clearLogs = () => ({
  type: "LOGS_CLEAR"
})

export const receiveLogTuples = (tuples: Tuple[]) => ({
  type: "LOGS_RECEIVE",
  tuples
})

export const setLogsSpliceIndex = (index: number) => ({
  type: "LOGS_SPLICE_INDEX_SET",
  index
})

export const spliceLogs = () => ({
  type: "LOGS_SPLICE"
})
