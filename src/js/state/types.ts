import {Action as ReduxAction, Store as ReduxStore} from "@reduxjs/toolkit"
import {ThunkAction, ThunkDispatch} from "@reduxjs/toolkit"
import {createZealot, Zealot} from "zealot-old"
import BrimApi from "../api"
import {AppearanceState} from "./Appearance"
import {ConfigPropValuesState} from "./ConfigPropValues"
import {ConfigsState} from "./Configs"
import {ErrorsState} from "./Errors/types"
import {FeatureState} from "./Feature"
import {HandlersState} from "./Handlers/types"
import {InvestigationState} from "./Investigation/types"
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
import {ViewState} from "./View/types"
import {LakesState} from "./Lakes/types"
import {WorkspaceStatusesState} from "./WorkspaceStatuses/types"

export type GetState = () => State
export type ThunkExtraArg = {
  zealot: Zealot
  createZealot: typeof createZealot
  dispatch: AppDispatch
  api: BrimApi
}

export type Action = ReduxAction<string>
export type Thunk<R = void> = ThunkAction<R, State, ThunkExtraArg, Action>
export type Store = ReduxStore<State, any>
export type AppDispatch = ThunkDispatch<State, ThunkExtraArg, Action>
export type Dispatch = AppDispatch

export type DispatchProps = {dispatch: Dispatch}
export type State = {
  appearance: AppearanceState
  launches: LaunchesState
  configs: ConfigsState
  configPropValues: ConfigPropValuesState
  tabHistories: TabHistoriesState
  handlers: HandlersState
  workspaces: LakesState
  errors: ErrorsState
  pools: PoolsState
  view: ViewState
  investigation: InvestigationState
  modal: ModalState
  notice: NoticeState
  tabs: TabsState
  pluginStorage: PluginStorageState
  workspaceStatuses: WorkspaceStatusesState
  queries: QueriesState
  remoteQueries: QueriesState
  systemTest: SystemTestState
  feature: FeatureState
  toolbars: ToolbarsState
}
