/* @flow */

import {combineReducers} from "redux"

import {VERSION} from "../initializers/initPersistance"
import {errorsReducer} from "./errors"
import boomd from "./reducers/boomd"
import clustersReducer from "./clusters/reducer"
import columnsReducer from "./columns/reducer"
import investigation from "./reducers/investigation"
import logDetails from "./reducers/logDetails"
import modal from "./modal"
import notice from "./notice"
import packets from "./reducers/packets"
import search from "./search"
import searchBar from "./reducers/searchBar"
import searchHistory from "./reducers/searchHistory"
import searchesReducer from "./searches/reducer"
import spaces from "./reducers/spaces"
import starredLogs from "./reducers/starredLogs"
import tasks from "./tasks"
import view from "./reducers/view"
import viewerReducer from "./viewer/reducer"

export default combineReducers<*, *>({
  errors: errorsReducer,
  searches: searchesReducer,
  viewer: viewerReducer,
  columns: columnsReducer,
  clusters: clustersReducer,
  modal: modal.reducer,
  search: search.reducer,
  notice: notice.reducer,
  tasks: tasks.reducer,
  investigation,
  view,
  searchBar,
  spaces,
  logDetails,
  boomd,
  starredLogs,
  packets,
  searchHistory,
  version: () => VERSION
})
