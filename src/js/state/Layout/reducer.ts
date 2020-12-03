import {LayoutState, LayoutAction} from "./types"

const init: LayoutState = {
  rightSidebarIsOpen: false,
  rightSidebarWidth: 450,
  leftSidebarIsOpen: true,
  leftSidebarWidth: 230,
  investigationView: "linear",
  columnHeadersView: "AUTO",
  sidebarSections: [{id: "spaces"}, {id: "queries"}, {id: "history"}]
}

export default function reducer(
  state: LayoutState = init,
  action: LayoutAction
): LayoutState {
  switch (action.type) {
    case "LAYOUT_SIDEBAR_SECTIONS_SET":
      return {
        ...state,
        sidebarSections: action.sections
      }
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
    case "LAYOUT_LEFT_SIDEBAR_SHOW":
      return {
        ...state,
        leftSidebarIsOpen: true
      }
    case "LAYOUT_LEFT_SIDEBAR_HIDE":
      return {
        ...state,
        leftSidebarIsOpen: false
      }
    case "LAYOUT_LEFT_SIDEBAR_TOGGLE":
      return {
        ...state,
        leftSidebarIsOpen: !state.leftSidebarIsOpen
      }
    case "LAYOUT_LEFT_SIDEBAR_WIDTH_SET":
      return {
        ...state,
        leftSidebarWidth: action.width
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
