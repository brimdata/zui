/* @flow */
import {createStore} from "redux"

import mainReducer, {type MainState} from "./mainReducer"

export default function(initialState: MainState | void) {
  // $FlowFixMe
  return createStore(mainReducer, initialState)
}
