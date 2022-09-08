import {Action as ReduxAction, Store as ReduxStore} from "redux"
import {ThunkAction, ThunkDispatch} from "redux-thunk"
import BrimApi from "../api"
import {AppearanceState} from "./Appearance"
import {ConfigPropValuesState} from "./ConfigPropValues"
import {ConfigsState} from "./Configs"
import {ErrorsState} from "./Errors/types"
import {HandlersState} from "./Handlers/types"
import Ingests from "./Ingests"
import {InvestigationState} from "./Investigation/types"
import {LakesState} from "./Lakes/types"
import {LaunchesState} from "./Launches"
import {ModalState} from "./Modal/types"
import {NoticeState} from "./Notice/types"
import {PluginStorageState} from "./PluginStorage"
import {PoolsState} from "./Pools/types"
import {QueriesState} from "./Queries/types"
import {SystemTestState} from "./SystemTest"
import {TabHistoriesState} from "./TabHistories/types"
import {TabsState} from "./Tabs/types"
import {ToolbarsState} from "./Toolbars"
import {LakeStatusesState} from "./LakeStatuses/types"
import {SessionQueriesState} from "./SessionQueries/types"
import {QueryVersionsState} from "./QueryVersions/types"
import {SessionHistoriesState} from "./SessionHistories/types"

export type ThunkExtraArg = {
  api: BrimApi
}

export type Action = ReduxAction<string>
export type Thunk<R = void> = ThunkAction<R, State, ThunkExtraArg, Action>
export type Store = ReduxStore<State, any>
export type AppDispatch = ThunkDispatch<State, ThunkExtraArg, Action>
export type Dispatch = AppDispatch
export type GetState = () => State

export type DispatchProps = {dispatch: Dispatch}
export type State = {
  appearance: AppearanceState
  launches: LaunchesState
  configs: ConfigsState
  configPropValues: ConfigPropValuesState
  tabHistories: TabHistoriesState
  handlers: HandlersState
  lakes: LakesState
  errors: ErrorsState
  pools: PoolsState
  ingests: ReturnType<typeof Ingests.reducer>
  investigation: InvestigationState
  modal: ModalState
  notice: NoticeState
  tabs: TabsState
  pluginStorage: PluginStorageState
  lakeStatuses: LakeStatusesState
  queries: QueriesState
  remoteQueries: QueriesState
  queryVersions: QueryVersionsState
  sessionQueries: SessionQueriesState
  sessionHistories: SessionHistoriesState
  systemTest: SystemTestState
  toolbars: ToolbarsState
}
