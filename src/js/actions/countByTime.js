/* @flow */

export const receiveCountByTime = (data: Object) => ({
  type: "COUNT_BY_TIME_RECEIVE",
  data
})

export const resetCountByTime = () => ({
  type: "COUNT_BY_TIME_RESET"
})
