/* @flow */

import * as SearchFactory from "../lib/SearchFactory"
import {type State} from "../reducers/types"

export const showModal = (modal: string) => ({
  type: "MODAL_SHOW",
  modal
})

export const hideModal = () => ({
  type: "MODAL_HIDE"
})

export const showRightSidebar = () => ({
  type: "RIGHT_SIDEBAR_SHOW"
})

export const hideRightSidebar = () => ({
  type: "RIGHT_SIDEBAR_HIDE"
})

export const showLeftSidebar = () => ({
  type: "LEFT_SIDEBAR_SHOW"
})

export const hideLeftSidebar = () => ({
  type: "LEFT_SIDEBAR_HIDE"
})

export const toggleRightSidebar = () => ({
  type: "RIGHT_SIDEBAR_TOGGLE"
})

export const toggleLeftSidebar = () => ({
  type: "LEFT_SIDEBAR_TOGGLE"
})

export const showAnalyticsTab = () => ({
  type: "SHOW_ANALYTICS_TAB"
})

export const showLogsTab = () => ({
  type: "SHOW_LOGS_TAB"
})

export const setTimeZone = (timeZone: string) => ({
  type: "TIME_ZONE_SET",
  timeZone
})

export const setRightSidebarWidth = (width: number) => ({
  type: "RIGHT_SIDEBAR_WIDTH_SET",
  width
})

export const setLeftSidebarWidth = (width: number) => ({
  type: "LEFT_SIDEBAR_WIDTH_SET",
  width
})

export const showDownloads = () => ({
  type: "DOWNLOADS_SHOW"
})

export const hideDownloads = () => ({
  type: "DOWNLOADS_HIDE"
})

export const updateTab = (state: State) =>
  SearchFactory.getType(state) === "ANALYTICS"
    ? showAnalyticsTab()
    : showLogsTab()
