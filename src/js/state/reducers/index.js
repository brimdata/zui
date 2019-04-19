/* @flow */

import {combineReducers} from "redux"

import analysis from "./analysis"
import boomd from "./boomd"
import correlations from "./correlations"
import histogram from "./histogram"
import investigation from "./investigation"
import logDetails from "./logDetails"
import logViewer from "./logViewer"
import logs from "./logs"
import notifications from "./notifications"
import packets from "./packets"
import searchBar from "./searchBar"
import searchHistory from "./searchHistory"
import searchesReducer from "../searches/reducer"
import spaces from "./spaces"
import starredLogs from "./starredLogs"
import tableColumnSets from "./tableColumnSets"
import timeWindow from "./timeWindow"
import view from "./view"
import viewerReducer from "../viewer/reducer"
import whois from "./whois"

export default combineReducers<*, *>({
  searches: searchesReducer,
  viewer: viewerReducer,
  investigation,
  correlations,
  logs,
  view,
  searchBar,
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
  tableColumnSets
})
