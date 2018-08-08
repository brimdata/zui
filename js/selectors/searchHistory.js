import pick from "lodash/pick"

export function getSearchHistoryEntry(state) {
  return pick(state, "searchBar", "timeWindow")
}
