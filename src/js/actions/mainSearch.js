export function requestMainSearch({saveToHistory, query}) {
  return {
    type: "MAIN_SEARCH_REQUEST",
    saveToHistory,
    query
  }
}

export function mainSearchEvents(events = []) {
  return {
    type: "MAIN_SEARCH_EVENTS",
    events
  }
}

export function completeMainSearch() {
  return {
    type: "MAIN_SEARCH_COMPLETE"
  }
}

export function appendMainSearchQueryProgram(fragment) {
  return {
    type: "MAIN_SEARCH_QUERY_PROGRAM_APPEND",
    fragment
  }
}
