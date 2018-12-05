import {pickEntryOffState} from "../reducers/searchHistory"

export const pushSearchHistory = () => (dispatch, getState) => {
  dispatch({
    type: "SEARCH_HISTORY_PUSH",
    entry: pickEntryOffState(getState())
  })
}

export const backSearchHistory = () => ({
  type: "SEARCH_HISTORY_BACK"
})

export const forwardSearchHistory = () => ({
  type: "SEARCH_HISTORY_FORWARD"
})
