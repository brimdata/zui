/* @flow */

import {combineReducers} from "redux"

import {VERSION} from "../initializers/initPersistance"
import Errors from "./Errors"
import boomd from "./reducers/boomd"
import clustersReducer from "./Clusters/reducer"
import Handlers from "./Handlers"
import investigation from "./reducers/investigation"
import logDetails from "./reducers/logDetails"
import modal from "./modal"
import notice from "./notice"
import packets from "./reducers/packets"
import spacesReducer from "./spaces/reducer"
import starredLogs from "./reducers/starredLogs"
import tabs from "./tabs"
import tasks from "./tasks"
import view from "./reducers/view"
import viewerReducer from "./viewer/reducer"

export default combineReducers<*, *>({
  errors: Errors.reducer,
  viewer: viewerReducer,
  clusters: clustersReducer,
  modal: modal.reducer,
  notice: notice.reducer,
  tasks: tasks.reducer,
  handlers: Handlers.reducer,
  tabs: tabs.reducer,
  investigation,
  view,
  spaces: spacesReducer,
  logDetails,
  boomd,
  starredLogs,
  packets,
  version: () => VERSION
})
