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
import Loads from "../Loads"
import PoolSettings from "../PoolSettings"
import Window from "../Window"
import LoadDataForm from "../LoadDataForm"
import Updates from "../Updates"
import {QuerySession} from "src/models/query-session"
import {Snapshot} from "src/models/snapshot"

const rootReducer = combineReducers<any>({
  appearance: Appearance.reducer,
  configPropValues: ConfigPropValues.reducer,
  errors: Errors.reducer,
  lakes: Lakes.reducer,
  lakeStatuses: LakeStatuses.reducer,
  launches: Launches.reducer,
  loadDataForm: LoadDataForm.reducer,
  loads: Loads.reducer,
  modal: Modal.reducer,
  notice: Notice.reducer,
  pools: Pools.reducer,
  poolSettings: PoolSettings.reducer,
  queries: Queries.reducer,
  tabHistories: TabHistories.reducer,
  toolbars: Toolbars.reducer,
  url: Url.reducer,
  window: Window.reducer,
  updates: Updates.reducer,
  ...QuerySession.slice,
  ...Snapshot.slice,
})

export default rootReducer
