/* @flow */

import {combineReducers} from "redux"

import {VERSION} from "../initializers/initPersistance"
import Errors from "./Errors"
import Handlers from "./Handlers"
import Modal from "./Modal"
import Notice from "./Notice"
import Spaces from "./Spaces"
import boomd from "./reducers/boomd"
import clustersReducer from "./Clusters/reducer"
import investigation from "./reducers/investigation"
import logDetails from "./reducers/logDetails"
import packets from "./reducers/packets"
import starredLogs from "./reducers/starredLogs"
import Tabs from "./Tabs"
import tasks from "./tasks"
import view from "./reducers/view"
import viewerReducer from "./viewer/reducer"

export default combineReducers<*, *>({
  errors: Errors.reducer,
  viewer: viewerReducer,
  clusters: clustersReducer,
  modal: Modal.reducer,
  notice: Notice.reducer,
  tasks: tasks.reducer,
  handlers: Handlers.reducer,
  tabs: Tabs.reducer,
  investigation,
  view,
  spaces: Spaces.reducer,
  logDetails,
  boomd,
  starredLogs,
  packets,
  version: () => VERSION
})
