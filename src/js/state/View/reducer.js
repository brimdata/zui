/* @flow */

import type {ViewAction, ViewState} from "./types"

const init: ViewState = {
  downloadsIsOpen: false,
  resultsTab: null,
  timeZone: "UTC",
  investigationView: "linear"
}

export default function reducer(
  state: ViewState = init,
  action: ViewAction
): ViewState {
  switch (action.type) {
    case "TIME_ZONE_SET":
      return {
        ...state,
        timeZone: action.timeZone
      }
    case "DOWNLOADS_SHOW":
      return {
        ...state,
        downloadsIsOpen: true
      }
    case "DOWNLOADS_HIDE":
      return {
        ...state,
        downloadsIsOpen: false
      }
    case "INVESTIGATION_VIEW_SET":
      return {
        ...state,
        investigationView: action.view
      }
    default:
      return state
  }
}
