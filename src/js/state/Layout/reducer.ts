import {LayoutState, LayoutAction} from "./types"

const init: LayoutState = {
  rightSidebarIsOpen: false,
  rightSidebarWidth: 260,
  investigationView: "linear",
  columnHeadersView: "AUTO"
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
    case "LAYOUT_INVESTIGATION_VIEW_SET":
      return {
        ...state,
        investigationView: action.view
      }
    case "LAYOUT_SET_COLUMN_HEADERS":
      return {...state, columnHeadersView: action.view}
    default:
      return state
  }
}
