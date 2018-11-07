export const setOuterTimeWindow = timeWindow => ({
  type: "OUTER_TIME_WINDOW_SET",
  timeWindow
})

export const setInnerTimeWindow = timeWindow => ({
  type: "INNER_TIME_WINDOW_SET",
  timeWindow
})

export const setOuterFromTime = date => ({
  type: "OUTER_FROM_TIME_SET",
  date
})

export const setOuterToTime = date => ({
  type: "OUTER_TO_TIME_SET",
  date
})
