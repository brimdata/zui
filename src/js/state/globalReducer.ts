import {combineReducers} from "redux"

import {InvestigationState} from "./Investigation/types"
import {PrefsState} from "./Prefs/types"
import Investigation from "./Investigation"
import Prefs from "./Prefs"
import Queries from "./Queries"
import {QueriesState} from "./Queries/types"
import Workspaces from "./Workspaces"
import {WorkspacesState} from "./Workspaces/types"
import PluginStorage from "./PluginStorage"
import Config, {ConfigsState} from "./Configs"

export type GlobalState = {
  workspaces: WorkspacesState
  investigation: InvestigationState
  prefs: PrefsState
  configs: ConfigsState
  queries: QueriesState
}

export default combineReducers<any, any>({
  workspaces: Workspaces.reducer,
  investigation: Investigation.reducer,
  prefs: Prefs.reducer,
  config: Config.reducer,
  pluginStorage: PluginStorage.reducer,
  queries: Queries.reducer
})
