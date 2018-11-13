/* @flow */

export const setMoreBehind = (value: boolean) => ({
  type: "LOG_VIEWER_MORE_BEHIND_SET",
  value
})

export const setMoreAhead = (value: boolean) => ({
  type: "LOG_VIEWER_MORE_AHEAD_SET",
  value
})

export const setIsFetchingBehind = (value: boolean) => ({
  type: "LOG_VIEWER_IS_FETCHING_BEHIND_SET",
  value
})

export const setIsFetchingAhead = (value: boolean) => ({
  type: "LOG_VIEWER_IS_FETCHING_AHEAD_SET",
  value
})
