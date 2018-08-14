import createReducer from "./createReducer"

const initalState = {
  leftSidebarIsOpen: true,
  rightSidebarIsOpen: true
}

export default createReducer(initalState, {
  LEFT_SIDEBAR_SHOW: state => ({
    ...state,
    leftSidebarIsOpen: true
  }),
  LEFT_SIDEBAR_HIDE: state => ({
    ...state,
    leftSidebarIsOpen: false
  }),
  RIGHT_SIDEBAR_SHOW: state => ({
    ...state,
    rightSidebarIsOpen: true
  }),
  RIGHT_SIDEBAR_HIDE: state => ({
    ...state,
    rightSidebarIsOpen: false
  }),
  LEFT_SIDEBAR_TOGGLE: state => ({
    ...state,
    leftSidebarIsOpen: !state.leftSidebarIsOpen
  }),
  RIGHT_SIDEBAR_TOGGLE: state => ({
    ...state,
    rightSidebarIsOpen: !state.rightSidebarIsOpen
  })
})

export const getLeftSidebarIsOpen = state => state.view.leftSidebarIsOpen
export const getRightSidebarIsOpen = state => state.view.rightSidebarIsOpen
