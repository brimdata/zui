export const requestCountByTime = () => ({
  type: "COUNT_BY_TIME_REQUEST"
})

export const completeCountByTime = () => ({
  type: "COUNT_BY_TIME_COMPLETE"
})

export const receiveCountByTime = data => ({
  type: "COUNT_BY_TIME_RECEIVE",
  data
})

export const errorCountByTime = error => ({
  type: "COUNT_BY_TIME_ERROR",
  error
})

export const successCountByTime = () => ({
  type: "COUNT_BY_TIME_SUCCESS"
})
