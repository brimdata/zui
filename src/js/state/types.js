/* @flow */

import {type Store as ReduxStore} from "redux"

import type {Boomd} from "./reducers/boomd"
import type {ClustersState} from "./clusters/types"
import type {ColumnsState} from "./columns/types"
import type {ErrorsState} from "./errors"
import type {HandlersState} from "./handlers"
import type {Investigation} from "./reducers/investigation"
import type {LogDetails} from "./reducers/logDetails"
import type {ModalState} from "./modal/types"
import type {NoticeState} from "./notice"
import type {SearchHistory} from "./reducers/searchHistory"
import type {Spaces} from "./reducers/spaces"
import type {TabsState} from "./tabs"
import type {TasksState} from "./tasks"
import type {View} from "./reducers/view"
import BoomClient from "../services/BoomClient"

export type GetState = () => State
export type Thunk = (Dispatch, GetState, BoomClient) => any
export type Dispatch = Function
export type Action = Object
export type DispatchProps = {|dispatch: Dispatch|}
export type Store = ReduxStore<State, *>

export type State = {
  handlers: HandlersState,
  clusters: ClustersState,
  errors: ErrorsState,
  columns: ColumnsState,
  spaces: Spaces,
  boomd: Boomd,
  tasks: TasksState,
  searchHistory: SearchHistory,
  logDetails: LogDetails,
  view: View,
  investigation: Investigation,
  modal: ModalState,
  notice: NoticeState,
  tabs: TabsState
}
