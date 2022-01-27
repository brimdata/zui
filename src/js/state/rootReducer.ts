import {combineReducers} from "@reduxjs/toolkit"

import Lakes from "./Lakes"
import Errors from "./Errors"
import Handlers from "./Handlers"
import Investigation from "./Investigation"
import Modal from "./Modal"
import Notice from "./Notice"
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
import ConfigPropValues from "./ConfigPropValues"
import Launches from "./Launches"
import Appearance from "./Appearance"
import RemoteQueries from "./RemoteQueries"
import Imports from "./Imports"

const rootReducer = combineReducers<any, any>({
  appearance: Appearance.reducer,
  launches: Launches.reducer,
  configs: Configs.reducer,
  configPropValues: ConfigPropValues.reducer,
  errors: Errors.reducer,
  workspaces: Lakes.reducer,
  modal: Modal.reducer,
  notice: Notice.reducer,
  handlers: Handlers.reducer,
  tabs: Tabs.reducer,
  investigation: Investigation.reducer,
  view: View.reducer,
  pools: Pools.reducer,
  imports: Imports.reducer,
  pluginStorage: PluginStorage.reducer,
  systemTest: SystemTest.reducer,
  feature: Feature.reducer,
  workspaceStatuses: WorkspaceStatuses.reducer,
  queries: Queries.reducer,
  remoteQueries: RemoteQueries.reducer,
  tabHistories: TabHistories.reducer,
  url: Url.reducer,
  toolbars: Toolbars.reducer
})

// A proof of concept. This would be a much nicer way to go
// once we have time to convert to it.
// type RootState = ReturnType<typeof rootReducer>

export default rootReducer
