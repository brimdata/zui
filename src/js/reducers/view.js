import createReducer from "./createReducer"

const ANALYTICS = "analytics"
const LOGS = "logs"

const initalState = {
  leftSidebarIsOpen: false,
  rightSidebarIsOpen: false,
  resultsTab: null, // can be "ANALYTICS" or "LOGS",
  timeZone: "UTC"
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
  }),
  SHOW_LOGS_TAB: state => ({
    ...state,
    resultsTab: LOGS
  }),
  SHOW_ANALYTICS_TAB: state => ({
    ...state,
    resultsTab: ANALYTICS
  }),
  TIME_ZONE_SET: (state, {timeZone}) => ({
    ...state,
    timeZone
  })
})

export const getLeftSidebarIsOpen = state => state.view.leftSidebarIsOpen
export const getRightSidebarIsOpen = state => state.view.rightSidebarIsOpen
export const getShowAnalyticsTab = state => state.view.resultsTab === ANALYTICS
export const getShowLogsTab = state => state.view.resultsTab === LOGS
export const getTimeZone = state => state.view.timeZone
