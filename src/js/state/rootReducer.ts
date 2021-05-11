import {combineReducers} from "redux"

import Workspaces from "./Workspaces"
import Errors from "./Errors"
import Handlers from "./Handlers"
import Investigation from "./Investigation"
import Modal from "./Modal"
import Notice from "./Notice"
import Prefs from "./Prefs"
import Pools from "./Pools"
import Tabs from "./Tabs"
import View from "./View"
import Queries from "./Queries"
import SystemTest from "./SystemTest"
import Feature from "./Feature"
import WorkspaceStatuses from "./WorkspaceStatuses"
import TabHistories from "./TabHistories"
import Url from "./Url"
import Toolbars from "./Toolbars"
import PluginStorage from "./PluginStorage"
import Configs from "./Configs"

export default combineReducers<any, any>({
  configs: Configs.reducer,
  errors: Errors.reducer,
  workspaces: Workspaces.reducer,
  modal: Modal.reducer,
  notice: Notice.reducer,
  handlers: Handlers.reducer,
  tabs: Tabs.reducer,
  investigation: Investigation.reducer,
  view: View.reducer,
  pools: Pools.reducer,
  prefs: Prefs.reducer,
  pluginStorage: PluginStorage.reducer,
  systemTest: SystemTest.reducer,
  feature: Feature.reducer,
  workspaceStatuses: WorkspaceStatuses.reducer,
  queries: Queries.reducer,
  tabHistories: TabHistories.reducer,
  url: Url.reducer,
  toolbars: Toolbars.reducer
})
