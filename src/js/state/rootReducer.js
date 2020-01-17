/* @flow */

import {combineReducers} from "redux"

import {VERSION} from "../initializers/initPersistance"
import Boomd from "./Boomd"
import Clusters from "./Clusters"
import Errors from "./Errors"
import Handlers from "./Handlers"
import Modal from "./Modal"
import Notice from "./Notice"
import Spaces from "./Spaces"
import Tabs from "./Tabs"
import Viewer from "./Viewer"
import investigation from "./reducers/investigation"
import logDetails from "./reducers/logDetails"
import packets from "./reducers/packets"
import starredLogs from "./reducers/starredLogs"
import view from "./reducers/view"

export default combineReducers<*, *>({
  errors: Errors.reducer,
  viewer: Viewer.reducer,
  clusters: Clusters.reducer,
  modal: Modal.reducer,
  notice: Notice.reducer,
  handlers: Handlers.reducer,
  tabs: Tabs.reducer,
  investigation,
  view,
  spaces: Spaces.reducer,
  logDetails,
  boomd: Boomd.reducer,
  starredLogs,
  packets,
  version: () => VERSION
})
