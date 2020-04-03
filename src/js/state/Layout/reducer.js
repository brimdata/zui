/* @flow */

import type {LayoutState, LayoutAction} from "./types"

const init: LayoutState = {
  rightSidebarIsOpen: false,
  rightSidebarWidth: 450
}

export default function reducer(
  state: LayoutState = init,
  action: LayoutAction
): LayoutState {
  switch (action.type) {
    case "LAYOUT_RIGHT_SIDEBAR_SHOW":
      return {
        ...state,
        rightSidebarIsOpen: true
      }
    case "LAYOUT_RIGHT_SIDEBAR_HIDE":
      return {
        ...state,
        rightSidebarIsOpen: false
      }
    case "LAYOUT_RIGHT_SIDEBAR_TOGGLE":
      return {
        ...state,
        rightSidebarIsOpen: !state.rightSidebarIsOpen
      }
    case "LAYOUT_RIGHT_SIDEBAR_WIDTH_SET":
      return {
        ...state,
        rightSidebarWidth: action.width
      }
    default:
      return state
  }
}
