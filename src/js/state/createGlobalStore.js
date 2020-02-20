/* @flow */
import {createStore} from "redux"

import globalReducer, {type GlobalState} from "./globalReducer"

export default function(initialState: GlobalState | void) {
  // $FlowFixMe
  return createStore(globalReducer, initialState)
}
