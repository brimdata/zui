/* @flow */

export const completeCountByTime = () => ({
  type: "COUNT_BY_TIME_COMPLETE"
})

export const receiveCountByTime = (data: Object) => ({
  type: "COUNT_BY_TIME_RECEIVE",
  data
})
