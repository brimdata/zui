import * as SearchFactory from "../lib/SearchFactory"

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

export const setTimeZone = timeZone => ({
  type: "TIME_ZONE_SET",
  timeZone
})

export const setRightSidebarWidth = width => ({
  type: "RIGHT_SIDEBAR_WIDTH_SET",
  width
})

export const setLeftSidebarWidth = width => ({
  type: "LEFT_SIDEBAR_WIDTH_SET",
  width
})

export const showDownloads = () => ({
  type: "DOWNLOADS_SHOW"
})

export const hideDownloads = () => ({
  type: "DOWNLOADS_HIDE"
})

export const updateTab = state =>
  SearchFactory.getType(state) === "ANALYTICS"
    ? showAnalyticsTab()
    : showLogsTab()
