export function requestCountByTime() {
  return {
    type: "COUNT_BY_TIME_REQUEST"
  }
}

export function completeCountByTime() {
  return {
    type: "COUNT_BY_TIME_COMPLETE"
  }
}

export function updateCountByTime(descriptor, tuples) {
  return {
    type: "COUNT_BY_TIME_UPDATE",
    descriptor,
    tuples
  }
}
