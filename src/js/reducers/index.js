/* @flow */

import {combineReducers} from "redux"

import analysis from "./analysis"
import boomSearches from "./boomSearches"
import boomd from "./boomd"
import countByTime from "./countByTime"
import descriptors from "./descriptors"
import filterTree from "./filterTree"
import initialLoad from "./initialLoad"
import logDetails from "./logDetails"
import logViewer from "./logViewer"
import logs from "./logs"
import mainSearch from "./mainSearch"
import notifications from "./notifications"
import packets from "./packets"
import searchBar from "./searchBar"
import searchHistory from "./searchHistory"
import selectedColumns from "./selectedColumns"
import spaces from "./spaces"
import starredLogs from "./starredLogs"
import tableColumnSets from "./tableColumnSets"
import timeWindow from "./timeWindow"
import tuplesByUid from "./tuplesByUid"
import view from "./view"
import whois from "./whois"

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
  boomd,
  starredLogs,
  packets,
  logViewer,
  selectedColumns,
  searchHistory,
  whois,
  notifications,
  tableColumnSets,
  boomSearches
})
