import {combineReducers} from "redux"

import {InvestigationState} from "./Investigation/types"
import {PrefsState} from "./Prefs/types"
import Investigation from "./Investigation"
import Prefs from "./Prefs"
import Queries from "./Queries"
import {QueriesState} from "./Queries/types"
import Workspaces from "./Workspaces"
import {WorkspacesState} from "./Workspaces/types"
import PluginStorage, {PluginStorageState} from "./PluginStorage"
import Configs, {ConfigsState} from "./Configs"
import ConfigPropValues, {ConfigPropValuesState} from "./ConfigPropValues"

export type GlobalState = {
  workspaces: WorkspacesState
  investigation: InvestigationState
  prefs: PrefsState
  configs: ConfigsState
  configPropValues: ConfigPropValuesState
  pluginStorage: PluginStorageState
  queries: QueriesState
}

export default combineReducers<any, any>({
  workspaces: Workspaces.reducer,
  investigation: Investigation.reducer,
  prefs: Prefs.reducer,
  configs: Configs.reducer,
  configPropValues: ConfigPropValues.reducer,
  pluginStorage: PluginStorage.reducer,
  queries: Queries.reducer
})
