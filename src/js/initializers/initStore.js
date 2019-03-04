/* @flow */

import {composeWithDevTools} from "redux-devtools-extension"
import {createStore, applyMiddleware} from "redux"
import reduxThunk from "redux-thunk"

import {type Action, type Dispatch, type State} from "../reducers/types"
import BoomClient from "../BoomClient"
import reducer from "../reducers"

export default (initialState?: State, boom: BoomClient) =>
  createStore<State, Action, Dispatch>(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(reduxThunk.withExtraArgument(boom)))
  )
