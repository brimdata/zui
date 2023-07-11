import {combineReducers} from "@reduxjs/toolkit"

import Lakes from "../Lakes"
import Errors from "../Errors"
import Modal from "../Modal"
import Notice from "../Notice"
import Pools from "../Pools"
import Queries from "../Queries"
import LakeStatuses from "../LakeStatuses"
import TabHistories from "../TabHistories"
import Url from "../Url"
import Toolbars from "../Toolbars"
import ConfigPropValues from "../ConfigPropValues"
import Launches from "../Launches"
import Appearance from "../Appearance"
import RemoteQueries from "../RemoteQueries"
import Loads from "../Loads"
import QueryVersions from "../QueryVersions"
import SessionQueries from "../SessionQueries"
import SessionHistories from "../SessionHistories"
import PoolSettings from "../PoolSettings"
import Current from "../Current"
import LakeTabs from "../LakeTabs"

const rootReducer = combineReducers<any, any>({
  current: Current.reducer,
  appearance: Appearance.reducer,
  launches: Launches.reducer,
  configPropValues: ConfigPropValues.reducer,
  errors: Errors.reducer,
  lakes: Lakes.reducer,
  modal: Modal.reducer,
  notice: Notice.reducer,
  loads: Loads.reducer,
  lakeStatuses: LakeStatuses.reducer,
  url: Url.reducer,
  toolbars: Toolbars.reducer,
  pools: Pools.reducer,
  poolSettings: PoolSettings.reducer,
  queries: Queries.reducer,
  queryVersions: QueryVersions.reducer,
  sessionQueries: SessionQueries.reducer,
  remoteQueries: RemoteQueries.reducer,
  sessionHistories: SessionHistories.reducer,
  lakeTabs: LakeTabs.reducer,
  tabHistories: TabHistories.reducer,
})

// A proof of concept. This would be a much nicer way to go
// once we have time to convert to it.
// type RootState = ReturnType<typeof rootReducer>

export default rootReducer
