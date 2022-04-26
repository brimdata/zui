import {combineReducers} from "redux"
import ConfigPropValues, {ConfigPropValuesState} from "./ConfigPropValues"
import Configs, {ConfigsState} from "./Configs"
import Investigation from "./Investigation"
import {InvestigationState} from "./Investigation/types"
import Lakes from "./Lakes"
import {LakesState} from "./Lakes/types"
import Launches, {LaunchesState} from "./Launches"
import PluginStorage, {PluginStorageState} from "./PluginStorage"
import Queries from "./Queries"
import {QueriesState} from "./Queries/types"
import RemoteQueries from "./RemoteQueries"
import {DraftQueriesState} from "./DraftQueries"

export type GlobalState = {
  launches: LaunchesState
  lakes: LakesState
  investigation: InvestigationState
  configs: ConfigsState
  configPropValues: ConfigPropValuesState
  pluginStorage: PluginStorageState
  queries: QueriesState
  remoteQueries: QueriesState
  draftQueries: DraftQueriesState
}

export default combineReducers<any, any>({
  launches: Launches.reducer,
  lakes: Lakes.reducer,
  investigation: Investigation.reducer,
  configs: Configs.reducer,
  configPropValues: ConfigPropValues.reducer,
  pluginStorage: PluginStorage.reducer,
  queries: Queries.reducer,
  remoteQueries: RemoteQueries.reducer,
})
