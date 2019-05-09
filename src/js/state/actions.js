/* @flow */
import type {Credentials} from "../lib/Credentials"
import type {DateTuple} from "../lib/TimeWindow"
import type {Descriptor, Notification, SearchRecord, Tuple} from "../types"
import type {Finding} from "./reducers/investigation"
import type {InvestigationView} from "./reducers/view"
import type {SearchBar} from "./reducers/searchBar"
import type {Space} from "../lib/Space"
import type {TimeWindow} from "./reducers/timeWindow"
import {isArray} from "../lib/is"
import Field from "../models/Field"

export const useBoomCache = (value: boolean) => ({
  type: "BOOMD_CACHE_USE_SET",
  value
})

export const useBoomIndex = (value: boolean) => ({
  type: "BOOMD_INDEX_USE_SET",
  value
})

export const setBoomdCredentials = (credentials: Credentials) => ({
  type: "BOOMD_CREDENTIALS_SET",
  credentials
})

export const createFinding = (finding: $Shape<Finding>) => ({
  type: "FINDING_CREATE",
  finding
})

export const updateFinding = (finding: $Shape<Finding>) => ({
  type: "FINDING_UPDATE",
  finding
})

export const deleteFindingByTs = (ts: Date[] | Date) => ({
  type: "FINDING_DELETE",
  ts: isArray(ts) ? ts : [ts]
})

export const clearInvestigation = () => ({
  type: "INVESTIGATION_CLEAR"
})

export const pushLogDetail = ({
  tuple,
  descriptor
}: {
  tuple: Tuple,
  descriptor: Descriptor
}) => ({
  type: "LOG_DETAIL_PUSH",
  tuple,
  descriptor
})

export const backLogDetail = () => ({
  type: "LOG_DETAIL_BACK"
})

export const forwardLogDetail = () => ({
  type: "LOG_DETAIL_FORWARD"
})

export const clearNotifications = () => ({
  type: "NOTIFICATIONS_CLEAR"
})

export const addNotification = (notification: Notification) => ({
  type: "NOTIFICATIONS_ADD",
  notification
})

export const removeNotification = (index: number) => ({
  type: "NOTIFICATIONS_REMOVE",
  index
})

export const requestPackets = (uid: string) => ({
  type: "PACKETS_REQUEST",
  uid
})

export const receivePackets = (uid: string, fileName: string) => ({
  type: "PACKETS_RECEIVE",
  uid,
  fileName
})

export const errorPackets = (uid: string, error: string) => ({
  type: "PACKETS_ERROR",
  error,
  uid
})

export const clearSearchBar = () => ({
  type: "SEARCH_BAR_CLEAR"
})

export const restoreSearchBar = (value: SearchBar) => ({
  type: "SEARCH_BAR_RESTORE",
  value
})

export const changeSearchBarInput = (value: string) => ({
  type: "SEARCH_BAR_INPUT_CHANGE",
  value
})

export const pinSearchBar = () => ({
  type: "SEARCH_BAR_PIN"
})

export const editSearchBarPin = (index: number) => ({
  type: "SEARCH_BAR_PIN_EDIT",
  index
})

export const removeSearchBarPin = (index: number) => ({
  type: "SEARCH_BAR_PIN_REMOVE",
  index
})

export const removeAllSearchBarPins = () => ({
  type: "SEARCH_BAR_PIN_REMOVE_ALL"
})

export const setSearchBarPins = (pinned: string[]) => ({
  type: "SEARCH_BAR_PINS_SET",
  pinned
})

export const appendQueryInclude = (field: Field) => ({
  type: "QUERY_INCLUDE_APPEND",
  field
})

export const appendQueryExclude = (field: Field) => ({
  type: "QUERY_EXCLUDE_APPEND",
  field
})

export const appendQueryCountBy = (field: Field) => ({
  type: "QUERY_COUNT_BY_APPEND",
  field
})

export const errorSearchBarParse = (error: string) => ({
  type: "SEARCH_BAR_PARSE_ERROR",
  error
})

export const submittingSearchBar = () => ({
  type: "SEARCH_BAR_SUBMIT"
})

export const backSearchHistory = () => ({
  type: "SEARCH_HISTORY_BACK"
})

export const forwardSearchHistory = () => ({
  type: "SEARCH_HISTORY_FORWARD"
})

export const clearSearchHistory = () => ({
  type: "SEARCH_HISTORY_CLEAR"
})

export const recordSearch = (record: SearchRecord) => ({
  type: "SEARCH_HISTORY_PUSH",
  entry: record
})

export function setSpaceInfo(spaceInfo: $Shape<Space>) {
  return {
    type: "SPACE_INFO_SET",
    spaceInfo
  }
}

export function setCurrentSpaceName(name: string) {
  return {
    type: "CURRENT_SPACE_NAME_SET",
    name
  }
}

export function setSpaceNames(names: string[]) {
  return {
    type: "SPACE_NAMES_SET",
    names
  }
}

export function clearSpaces() {
  return {
    type: "SPACES_CLEAR"
  }
}

export const starLog = (tuple: Tuple) => ({
  type: "LOG_STAR",
  tuple
})

export const unstarLog = (tuple: Tuple) => ({
  type: "LOG_UNSTAR",
  tuple
})

export const clearStarredLogs = () => ({
  type: "STARRED_LOGS_CLEAR"
})

export const setOuterTimeWindow = (timeWindow: DateTuple) => ({
  type: "OUTER_TIME_WINDOW_SET",
  timeWindow
})

export const setInnerTimeWindow = (timeWindow: ?DateTuple) => ({
  type: "INNER_TIME_WINDOW_SET",
  timeWindow
})

export const setOuterFromTime = (date: Date) => ({
  type: "OUTER_FROM_TIME_SET",
  date
})

export const setOuterToTime = (date: Date) => ({
  type: "OUTER_TO_TIME_SET",
  date
})

export const clearTimeWindows = () => ({
  type: "TIME_WINDOWS_CLEAR"
})

export const restoreTimeWindow = (value: TimeWindow) => ({
  type: "TIME_WINDOW_RESTORE",
  value
})

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

export const showSearchInspector = () => ({
  type: "SEARCH_INSPECTOR_SHOW"
})

export const hideSearchInspector = () => ({
  type: "SEARCH_INSPECTOR_HIDE"
})

export const successWhois = (text: string) => ({
  type: "WHOIS_SUCCESS",
  text
})

export const errorWhois = (error: string) => ({
  type: "WHOIS_ERROR",
  error
})

export const requestWhois = (addr: string) => ({
  type: "WHOIS_REQUEST",
  addr
})

export const openWhois = () => ({
  type: "WHOIS_OPEN"
})

export const closeWhois = () => ({
  type: "WHOIS_CLOSE"
})

export const setInvestigationView = (view: InvestigationView) => ({
  type: "INVESTIGATION_VIEW_SET",
  view
})
