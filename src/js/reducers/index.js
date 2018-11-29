/* @flow */

import {combineReducers} from "redux"
import descriptors from "./descriptors"
import mainSearch from "./mainSearch"
import eventsByUid from "./eventsByUid"
import initialLoad from "./initialLoad"
import spaces from "./spaces"
import currentSpaceName from "./currentSpaceName"
import timeWindow from "./timeWindow"
import filterTree from "./filterTree"
import countByTime from "./countByTime"
import analysis from "./analysis"
import logDetails from "./logDetails"
import searchStats from "./searchStats"
import boomdCredentials from "./boomdCredentials"
import boomdConnection from "./boomdConnection"
import searchBar from "./searchBar"
import view from "./view"
import starredLogs from "./starredLogs"
import logs from "./logs"
import packets from "./packets"
import notices from "./notices"
import logViewer from "./logViewer"
import columnWidths from "./columnWidths"
import selectedColumns from "./selectedColumns"

export default combineReducers({
  logs,
  view,
  searchBar,
  initialLoad,
  descriptors,
  mainSearch,
  eventsByUid,
  spaces,
  currentSpaceName,
  timeWindow,
  filterTree,
  countByTime,
  analysis,
  logDetails,
  searchStats,
  boomdCredentials,
  boomdConnection,
  starredLogs,
  packets,
  notices,
  logViewer,
  columnWidths,
  selectedColumns
})
