/* @flow */

import {combineReducers} from "redux"

import {VERSION} from "../initializers/initPersistance"
import {errorsReducer} from "./errors"
import boomd from "./reducers/boomd"
import clustersReducer from "./clusters/reducer"
import handlers from "./handlers"
import investigation from "./reducers/investigation"
import logDetails from "./reducers/logDetails"
import modal from "./modal"
import notice from "./notice"
import packets from "./reducers/packets"
import searchHistory from "./reducers/searchHistory"
import spacesReducer from "./spaces/reducer"
import starredLogs from "./reducers/starredLogs"
import tabs from "./tabs"
import tasks from "./tasks"
import view from "./reducers/view"
import viewerReducer from "./viewer/reducer"

export default combineReducers<*, *>({
  errors: errorsReducer,
  viewer: viewerReducer,
  clusters: clustersReducer,
  modal: modal.reducer,
  notice: notice.reducer,
  tasks: tasks.reducer,
  handlers: handlers.reducer,
  tabs: tabs.reducer,
  investigation,
  view,
  spaces: spacesReducer,
  logDetails,
  boomd,
  starredLogs,
  packets,
  searchHistory,
  version: () => VERSION
})
