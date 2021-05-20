import {combineReducers} from "redux"
import ConfigPropValues, {ConfigPropValuesState} from "./ConfigPropValues"
import Configs, {ConfigsState} from "./Configs"
import Investigation from "./Investigation"
import {InvestigationState} from "./Investigation/types"
import Launches, {LaunchesState} from "./Launches"
import PluginStorage, {PluginStorageState} from "./PluginStorage"
import Prefs from "./Prefs"
import {PrefsState} from "./Prefs/types"
import Queries from "./Queries"
import {QueriesState} from "./Queries/types"
import Workspaces from "./Workspaces"
import {WorkspacesState} from "./Workspaces/types"

export type GlobalState = {
  launches: LaunchesState
  workspaces: WorkspacesState
  investigation: InvestigationState
  prefs: PrefsState
  configs: ConfigsState
  configPropValues: ConfigPropValuesState
  pluginStorage: PluginStorageState
  queries: QueriesState
}

export default combineReducers<any, any>({
  launches: Launches.reducer,
  workspaces: Workspaces.reducer,
  investigation: Investigation.reducer,
  prefs: Prefs.reducer,
  configs: Configs.reducer,
  configPropValues: ConfigPropValues.reducer,
  pluginStorage: PluginStorage.reducer,
  queries: Queries.reducer
})
