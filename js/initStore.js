import {createStore, applyMiddleware} from "redux"
import {composeWithDevTools} from "redux-devtools-extension"
import reducer from "./reducers"
import browserHistoryMiddleware from "./browserHistoryMiddleware"
import reduxThunk from "redux-thunk"
import {loadState, saveState} from "./persistance"
import throttle from "lodash/throttle"
import Client from "./boom/Client"

export default function() {
  const store = createStore(
    reducer,
    loadState(),
    composeWithDevTools(
      applyMiddleware(
        reduxThunk.withExtraArgument(new Client()),
        browserHistoryMiddleware
      )
    )
  )

  store.subscribe(
    throttle(() => {
      saveState(store.getState())
    }),
    1000
  )

  return store
}

export function initTestStore(...middleware) {
  return createStore(reducer, applyMiddleware(...middleware))
}
