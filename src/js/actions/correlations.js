/* @flow */

import type {Correlation} from "../types"

export const setCorrelation = (key: string, correlation: Correlation) => ({
  type: "CORRELATION_SET",
  key,
  correlation
})

export const clearCorrelations = (key: string) => ({
  type: "CORRELATIONS_CLEAR",
  key
})

export const clearAllCorrelations = () => ({
  type: "CORRELATIONS_CLEAR_ALL"
})
