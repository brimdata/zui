/* @flow */

export const receiveHistogram = (data: Object) => ({
  type: "COUNT_BY_TIME_RECEIVE",
  data
})

export const clearHistogram = () => ({
  type: "COUNT_BY_TIME_CLEAR"
})
