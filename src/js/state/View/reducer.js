/* @flow */

import type {ViewAction, ViewState} from "./types"

const init: ViewState = {
  leftSidebarIsOpen: false,
  rightSidebarIsOpen: false,
  downloadsIsOpen: false,
  leftSidebarWidth: 350,
  rightSidebarWidth: 450,
  resultsTab: null,
  timeZone: "UTC",
  investigationView: "linear"
}

export default function reducer(
  state: ViewState = init,
  action: ViewAction
): ViewState {
  switch (action.type) {
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
    case "RIGHT_SIDEBAR_SHOW":
      return {
        ...state,
        rightSidebarIsOpen: true
      }
    case "RIGHT_SIDEBAR_HIDE":
      return {
        ...state,
        rightSidebarIsOpen: false
      }
    case "LEFT_SIDEBAR_TOGGLE":
      return {
        ...state,
        leftSidebarIsOpen: !state.leftSidebarIsOpen
      }
    case "RIGHT_SIDEBAR_TOGGLE":
      return {
        ...state,
        rightSidebarIsOpen: !state.rightSidebarIsOpen
      }
    case "TIME_ZONE_SET":
      return {
        ...state,
        timeZone: action.timeZone
      }
    case "RIGHT_SIDEBAR_WIDTH_SET":
      return {
        ...state,
        rightSidebarWidth: action.width
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
