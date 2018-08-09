export function setFilters(appliedFilters) {
  return {
    type: "FILTER_NODES_SET",
    appliedFilters
  }
}

export function setTimeWindow(timeWindow) {
  return {
    type: "TIME_WINDOW_SET",
    timeWindow
  }
}
