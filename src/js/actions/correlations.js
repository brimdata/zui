/* @flow */

export const setCorrelation = (key: string, name: string, data: *) => ({
  type: "CORRELATION_SET",
  key,
  name,
  data
})

export const clearCorrelations = (key: string) => ({
  type: "CORRELATIONS_CLEAR",
  key
})

export const clearAllCorrelations = () => ({
  type: "CORRELATIONS_CLEAR_ALL"
})
