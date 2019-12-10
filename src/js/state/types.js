/* @flow */

import {type Store as ReduxStore} from "redux"

import type {Boomd} from "./reducers/boomd"
import type {ClustersState} from "./clusters/types"
import type {ColumnsState} from "./columns/types"
import type {ErrorsState} from "./errors"
import type {Investigation} from "./reducers/investigation"
import type {LogDetails} from "./reducers/logDetails"
import type {ModalState} from "../modal/types"
import type {NoticeState} from "./notice"
import type {SearchBar} from "./reducers/searchBar"
import type {SearchHistory} from "./reducers/searchHistory"
import type {SearchState} from "./search/types"
import type {SearchesState} from "./searches/types"
import type {Spaces} from "./reducers/spaces"
import type {TasksState} from "./tasks"
import type {View} from "./reducers/view"
import type {ViewerState} from "./viewer/types"
import BoomClient from "../services/BoomClient"

export type GetState = () => State
export type Thunk = (Dispatch, GetState, BoomClient) => any
export type Dispatch = Function
export type Action = Object
export type DispatchProps = {|dispatch: Dispatch|}
export type Store = ReduxStore<State, *>

export type State = {
  clusters: ClustersState,
  errors: ErrorsState,
  columns: ColumnsState,
  viewer: ViewerState,
  searches: SearchesState,
  searchBar: SearchBar,
  spaces: Spaces,
  boomd: Boomd,
  tasks: TasksState,
  searchHistory: SearchHistory,
  logDetails: LogDetails,
  view: View,
  investigation: Investigation,
  modal: ModalState,
  search: SearchState,
  notice: NoticeState
}
