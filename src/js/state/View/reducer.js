/* @flow */

import type {ViewAction, ViewState} from "./types"

const init: ViewState = {
  leftSidebarIsOpen: false,
  downloadsIsOpen: false,
  leftSidebarWidth: 350,
  resultsTab: null,
  timeZone: "UTC",
  investigationView: "linear",
  isIngesting: false
}

export default function reducer(
  state: ViewState = init,
  action: ViewAction
): ViewState {
  switch (action.type) {
    case "INGESTING_SET":
      return {
        ...state,
        isIngesting: action.value
      }
    case "LEFT_SIDEBAR_SHOW":
      return {
        ...state,
        leftSidebarIsOpen: true
      }
    case "LEFT_SIDEBAR_HIDE":
      return {
        ...state,
        leftSidebarIsOpen: false
      }
    case "LEFT_SIDEBAR_TOGGLE":
      return {
        ...state,
        leftSidebarIsOpen: !state.leftSidebarIsOpen
      }
    case "TIME_ZONE_SET":
      return {
        ...state,
        timeZone: action.timeZone
      }
    case "LEFT_SIDEBAR_WIDTH_SET":
      return {
        ...state,
        leftSidebarWidth: action.width
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
