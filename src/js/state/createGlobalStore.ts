import {createStore} from "redux"

import globalReducer, {GlobalState} from "./globalReducer"

export default function(initState: GlobalState | undefined) {
  return createStore(globalReducer, initState)
}
