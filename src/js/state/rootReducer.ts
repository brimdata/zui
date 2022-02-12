import {combineReducers} from "@reduxjs/toolkit"

import Lakes from "./Lakes"
import Errors from "./Errors"
import Handlers from "./Handlers"
import Investigation from "./Investigation"
import Modal from "./Modal"
import Notice from "./Notice"
import Pools from "./Pools"
import Tabs from "./Tabs"
import Queries from "./Queries"
import SystemTest from "./SystemTest"
import LakeStatuses from "./LakeStatuses"
import TabHistories from "./TabHistories"
import Url from "./Url"
import Toolbars from "./Toolbars"
import PluginStorage from "./PluginStorage"
import Configs from "./Configs"
import ConfigPropValues from "./ConfigPropValues"
import Launches from "./Launches"
import Appearance from "./Appearance"
import RemoteQueries from "./RemoteQueries"
import Ingests from "./Ingests"
import DraftQueries from "./DraftQueries"

const rootReducer = combineReducers<any, any>({
  appearance: Appearance.reducer,
  launches: Launches.reducer,
  configs: Configs.reducer,
  configPropValues: ConfigPropValues.reducer,
  errors: Errors.reducer,
  lakes: Lakes.reducer,
  modal: Modal.reducer,
  notice: Notice.reducer,
  handlers: Handlers.reducer,
  tabs: Tabs.reducer,
  investigation: Investigation.reducer,
  pools: Pools.reducer,
  ingests: Ingests.reducer,
  pluginStorage: PluginStorage.reducer,
  systemTest: SystemTest.reducer,
  lakeStatuses: LakeStatuses.reducer,
  queries: Queries.reducer,
  remoteQueries: RemoteQueries.reducer,
  draftQueries: DraftQueries.reducer,
  tabHistories: TabHistories.reducer,
  url: Url.reducer,
  toolbars: Toolbars.reducer
})

// A proof of concept. This would be a much nicer way to go
// once we have time to convert to it.
// type RootState = ReturnType<typeof rootReducer>

export default rootReducer
