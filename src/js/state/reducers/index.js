/* @flow */

import {combineReducers} from "redux"

import analysis from "./analysis"
import boomSearches from "./boomSearches"
import boomd from "./boomd"
import correlations from "./correlations"
import descriptors from "./descriptors"
import histogram from "./histogram"
import investigation from "./investigation"
import logDetails from "./logDetails"
import logViewer from "./logViewer"
import logs from "./logs"
import notifications from "./notifications"
import packets from "./packets"
import resultsReducer from "../results/reducer"
import searchBar from "./searchBar"
import searchHistory from "./searchHistory"
import spaces from "./spaces"
import starredLogs from "./starredLogs"
import tableColumnSets from "./tableColumnSets"
import timeWindow from "./timeWindow"
import view from "./view"
import whois from "./whois"

export default combineReducers<*, *>({
  results: resultsReducer,
  investigation,
  correlations,
  logs,
  view,
  searchBar,
  descriptors,
  spaces,
  timeWindow,
  histogram,
  analysis,
  logDetails,
  boomd,
  starredLogs,
  packets,
  logViewer,
  searchHistory,
  whois,
  notifications,
  tableColumnSets,
  boomSearches
})
