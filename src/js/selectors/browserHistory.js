import * as selectors from "."

export function getBrowserHistoryState(state) {
  return {
    query: selectors.getMainSearchQuery(state)
  }
}
