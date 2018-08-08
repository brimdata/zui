export function pushSearchHistory(entry) {
  return {
    type: "SEARCH_HISTORY_PUSH",
    entry
  }
}
