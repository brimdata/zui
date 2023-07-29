import {Action as ReduxAction, Store as ReduxStore} from "redux"
import {ThunkAction, ThunkDispatch} from "redux-thunk"
import ZuiApi from "../api/zui-api"
import {AppearanceState} from "./Appearance"
import {ConfigPropValuesState} from "./ConfigPropValues"
import {ErrorsState} from "./Errors/types"
import {LoadsState} from "./Loads/types"
import {LakesState} from "./Lakes/types"
import {LaunchesState} from "./Launches"
import {ModalState} from "./Modal/types"
import {NoticeState} from "./Notice/types"
import {PoolsState} from "./Pools/types"
import {QueriesState} from "./Queries/types"
import {TabHistoriesState} from "./TabHistories/types"
import {ToolbarsState} from "./Toolbars"
import {LakeStatusesState} from "./LakeStatuses/types"
import {SessionQueriesState} from "./SessionQueries/types"
import {QueryVersionsState} from "./QueryVersions/types"
import {SessionHistoriesState} from "./SessionHistories/types"
import {PoolSettingsState} from "./PoolSettings/types"
import {WindowState} from "./Window/types"

export type ThunkExtraArg = {
  api: ZuiApi
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
  configPropValues: ConfigPropValuesState
  errors: ErrorsState
  lakes: LakesState
  lakeStatuses: LakeStatusesState
  launches: LaunchesState
  loads: LoadsState
  modal: ModalState
  notice: NoticeState
  pools: PoolsState
  poolSettings: PoolSettingsState
  queries: QueriesState
  queryVersions: QueryVersionsState
  remoteQueries: QueriesState
  sessionHistories: SessionHistoriesState
  sessionQueries: SessionQueriesState
  tabHistories: TabHistoriesState
  toolbars: ToolbarsState
  window: WindowState
}
