/* @flow */

import {type State} from "./types"
import createReducer from "./createReducer"

const ANALYTICS = "analytics"
const LOGS = "logs"

export type ResultsTabEnum = "analytics" | "logs" | null

export type ModalEnum = "curl" | "debug" | "settings"

export type View = {
  searchInspectorIsOpen: boolean,
  leftSidebarIsOpen: boolean,
  rightSidebarIsOpen: boolean,
  downloadsIsOpen: boolean,
  leftSidebarWidth: number,
  rightSidebarWidth: number,
  resultsTab: ResultsTabEnum,
  timeZone: string,
  modal: ?ModalEnum
}

export const initalState: View = {
  searchInspectorIsOpen: false,
  leftSidebarIsOpen: false,
  rightSidebarIsOpen: false,
  downloadsIsOpen: false,
  leftSidebarWidth: 350,
  rightSidebarWidth: 450,
  resultsTab: null,
  timeZone: "UTC",
  modal: null
}

export default createReducer(initalState, {
  MODAL_SHOW: (state, {modal}) => ({
    ...state,
    modal
  }),
  MODAL_HIDE: (state) => ({
    ...state,
    modal: null
  }),
  LEFT_SIDEBAR_SHOW: (state) => ({
    ...state,
    leftSidebarIsOpen: true
  }),
  LEFT_SIDEBAR_HIDE: (state) => ({
    ...state,
    leftSidebarIsOpen: false
  }),
  RIGHT_SIDEBAR_SHOW: (state) => ({
    ...state,
    rightSidebarIsOpen: true
  }),
  RIGHT_SIDEBAR_HIDE: (state) => ({
    ...state,
    rightSidebarIsOpen: false
  }),
  LEFT_SIDEBAR_TOGGLE: (state) => ({
    ...state,
    leftSidebarIsOpen: !state.leftSidebarIsOpen
  }),
  RIGHT_SIDEBAR_TOGGLE: (state) => ({
    ...state,
    rightSidebarIsOpen: !state.rightSidebarIsOpen
  }),
  SHOW_LOGS_TAB: (state) => ({
    ...state,
    resultsTab: LOGS
  }),
  SHOW_ANALYTICS_TAB: (state) => ({
    ...state,
    resultsTab: ANALYTICS
  }),
  TIME_ZONE_SET: (state, {timeZone}) => ({
    ...state,
    timeZone
  }),
  RIGHT_SIDEBAR_WIDTH_SET: (state, {width}) => ({
    ...state,
    rightSidebarWidth: width
  }),
  LEFT_SIDEBAR_WIDTH_SET: (state, {width}) => ({
    ...state,
    leftSidebarWidth: width
  }),
  DOWNLOADS_SHOW: (state) => ({
    ...state,
    downloadsIsOpen: true
  }),
  DOWNLOADS_HIDE: (state) => ({
    ...state,
    downloadsIsOpen: false
  }),
  SEARCH_INSPECTOR_SHOW: (state) => ({
    ...state,
    searchInspectorIsOpen: true
  }),
  SEARCH_INSPECTOR_HIDE: (state) => ({
    ...state,
    searchInspectorIsOpen: false
  })
})

export const getSearchInspectorIsOpen = (state: State) => {
  return state.view.searchInspectorIsOpen
}

export const getRightSidebarWidth = (state: State) =>
  state.view.rightSidebarWidth

export const getLeftSidebarWidth = (state: State) => state.view.leftSidebarWidth

export const getLeftSidebarIsOpen = (state: State) =>
  state.view.leftSidebarIsOpen

export const getRightSidebarIsOpen = (state: State) =>
  state.view.rightSidebarIsOpen

export const getDownloadsIsOpen = (state: State) => state.view.downloadsIsOpen

export const getShowAnalyticsTab = (state: State) =>
  state.view.resultsTab === ANALYTICS

export const getShowLogsTab = (state: State) => state.view.resultsTab === LOGS

export const getTimeZone = (state: State) => state.view.timeZone

export const getResultsTab = (state: State) => state.view.resultsTab

export const getModal = (state: State) => state.view.modal

export const getDebugModalIsOpen = (state: State) => getModal(state) === "debug"

export const getCurlModalIsOpen = (state: State) => getModal(state) === "curl"

export const getSettingsModalIsOpen = (state: State) =>
  getModal(state) === "settings"
