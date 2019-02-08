/* @flow */

import {combineReducers} from "redux"
import descriptors from "./descriptors"
import mainSearch from "./mainSearch"
import tuplesByUid from "./tuplesByUid"
import initialLoad from "./initialLoad"
import spaces from "./spaces"
import timeWindow from "./timeWindow"
import filterTree from "./filterTree"
import countByTime from "./countByTime"
import analysis from "./analysis"
import logDetails from "./logDetails"
import searchStats from "./searchStats"
import boomdCredentials from "./boomdCredentials"
import searchBar from "./searchBar"
import view from "./view"
import starredLogs from "./starredLogs"
import logs from "./logs"
import packets from "./packets"
import logViewer from "./logViewer"
import columnWidths from "./columnWidths"
import selectedColumns from "./selectedColumns"
import searchHistory from "./searchHistory"
import whois from "./whois"
import notifications from "./notifications"
import columnGroups from "./columnGroups"

export default combineReducers<*, *>({
  logs,
  view,
  searchBar,
  initialLoad,
  descriptors,
  mainSearch,
  tuplesByUid,
  spaces,
  timeWindow,
  filterTree,
  countByTime,
  analysis,
  logDetails,
  searchStats,
  boomdCredentials,
  starredLogs,
  packets,
  logViewer,
  columnWidths,
  selectedColumns,
  searchHistory,
  whois,
  notifications,
  columnGroups
})
