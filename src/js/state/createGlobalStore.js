/* @flow */
import {createStore} from "redux"

import globalReducer, {type GlobalState} from "./globalReducer"

export default function(initState: GlobalState | void) {
  // $FlowFixMe
  return createStore(globalReducer, initState)
}
