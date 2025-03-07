import {Action as ReduxAction} from "redux"
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
import {PoolSettingsState} from "./PoolSettings/types"
import {WindowState} from "./Window/types"
import {LoadDataFormState} from "./LoadDataForm/types"
import {UpdatesState} from "./Updates/types"
import {EnhancedStore} from "@reduxjs/toolkit"
import {QuerySessionState} from "src/models/query-session"
import {SnapshotsState} from "src/models/snapshot"

export type ThunkExtraArg = {
  api: ZuiApi
}

export type Action = ReduxAction<string>
export type Thunk<R = void> = ThunkAction<R, State, ThunkExtraArg, Action>
export type Store = EnhancedStore<State, any, any>
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
  loadDataForm: LoadDataFormState
  loads: LoadsState
  modal: ModalState
  notice: NoticeState
  pools: PoolsState
  poolSettings: PoolSettingsState
  queries: QueriesState
  tabHistories: TabHistoriesState
  toolbars: ToolbarsState
  window: WindowState
  updates: UpdatesState
  querySessions: QuerySessionState
  snapshots: SnapshotsState
}
