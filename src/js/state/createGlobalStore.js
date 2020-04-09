/* @flow */
import {createStore} from "redux"

import {isCurrentVersion} from "../initializers/initPersistance"
import globalReducer, {type GlobalState} from "./globalReducer"

export default function(prevState: GlobalState | void) {
  let initState = isCurrentVersion(prevState) ? prevState : undefined

  // $FlowFixMe
  return createStore(globalReducer, initState)
}
