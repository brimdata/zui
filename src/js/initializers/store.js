/* @flow */

import {createStore, applyMiddleware} from "redux"
import {composeWithDevTools} from "redux-devtools-extension"
import reducer from "../reducers"
import reduxThunk from "redux-thunk"
import Client from "boom-js-client"
import type {State} from "../reducers/types"

export default (initialState: State | void, api: Client) =>
  createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(reduxThunk.withExtraArgument(api)))
  )
