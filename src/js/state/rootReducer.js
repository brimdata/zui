/* @flow */

import {combineReducers} from "redux"

import {VERSION} from "../initializers/initPersistance"
import Boomd from "./Boomd"
import Clusters from "./Clusters"
import Errors from "./Errors"
import Handlers from "./Handlers"
import Investigation from "./Investigation"
import LogDetails from "./LogDetails"
import Modal from "./Modal"
import Notice from "./Notice"
import Packets from "./Packets"
import Spaces from "./Spaces"
import Tabs from "./Tabs"
import Viewer from "./Viewer"
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
  investigation: Investigation.reducer,
  view,
  spaces: Spaces.reducer,
  logDetails: LogDetails.reducer,
  boomd: Boomd.reducer,
  starredLogs,
  packets: Packets.reducer,
  version: () => VERSION
})
