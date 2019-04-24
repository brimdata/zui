/* @flow */

import {composeWithDevTools} from "redux-devtools-extension"
import {createStore, applyMiddleware} from "redux"
import reduxThunk from "redux-thunk"

import type {Action, Dispatch, State} from "../state/types"
import BoomClient from "../BoomClient"
import reducer from "../state/reducers"

export default (initialState?: State, boom?: BoomClient) =>
  //$FlowFixMe
  createStore<State, Action, Dispatch>(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(reduxThunk.withExtraArgument(boom)))
  )
