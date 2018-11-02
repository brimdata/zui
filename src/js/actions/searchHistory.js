import {getSearchHistoryEntry} from "../reducers/searchHistory"

export const pushSearchHistory = () => (dispatch, getState) => {
  dispatch({
    type: "SEARCH_HISTORY_PUSH",
    entry: getSearchHistoryEntry(getState())
  })
}
