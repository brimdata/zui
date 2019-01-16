/* @flow */

import type {Tuple} from "../models/Log"

export const starLog = (tuple: Tuple) => ({
  type: "LOG_STAR",
  tuple
})

export const unstarLog = (tuple: Tuple) => ({
  type: "LOG_UNSTAR",
  tuple
})

export const clearStarredLogs = () => ({
  type: "STARRED_LOGS_CLEAR"
})
