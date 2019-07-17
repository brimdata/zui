/* @flow */

import {combineReducers} from "redux"

import {backendReducer} from "../backend"
import {errorsReducer} from "./errors"
import boomd from "./reducers/boomd"
import clustersReducer from "./clusters/reducer"
import columnsReducer from "./columns/reducer"
import investigation from "./reducers/investigation"
import logDetails from "./reducers/logDetails"
import packets from "./reducers/packets"
import searchBar from "./reducers/searchBar"
import searchHistory from "./reducers/searchHistory"
import searchesReducer from "./searches/reducer"
import spaces from "./reducers/spaces"
import starredLogs from "./reducers/starredLogs"
import timeWindow from "./reducers/timeWindow"
import view from "./reducers/view"
import viewerReducer from "./viewer/reducer"
import whois from "./reducers/whois"

export default combineReducers<*, *>({
  backend: backendReducer,
  errors: errorsReducer,
  searches: searchesReducer,
  viewer: viewerReducer,
  columns: columnsReducer,
  clusters: clustersReducer,
  investigation,
  view,
  searchBar,
  spaces,
  timeWindow,
  logDetails,
  boomd,
  starredLogs,
  packets,
  searchHistory,
  whois
})
