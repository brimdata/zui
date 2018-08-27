import {createStore, applyMiddleware} from "redux"
import {composeWithDevTools} from "redux-devtools-extension"
import reducer from "./reducers"
import reduxThunk from "redux-thunk"
import {loadState, saveState} from "./persistance"
import throttle from "lodash/throttle"
import Client from "boom-js-client"
import {getCredentials} from "./reducers/boomdCredentials"

export default function() {
  const state = loadState()

  const store = createStore(
    reducer,
    state,
    composeWithDevTools(
      applyMiddleware(
        reduxThunk.withExtraArgument(new Client(state && getCredentials(state)))
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
