import {Action, State} from "../state/types"
import {createZealotMock, Zealot} from "zealot"
import rootReducer from "../state/rootReducer"
import {configureStore} from "@reduxjs/toolkit"

export type TestStore = {
  dispatch: Function
  dispatchAll: Function
  getActions: Function
  getActionTypes: Function
  clearActions: Function
  getState: () => State
}

export default (zealot?: Zealot): TestStore => {
  let store
  const client = zealot || createZealotMock().zealot
  // This is so that tests can use globalDispatch without actually making
  // electron ipc calls. In the tests, globalDispatch is an alias for dispatch.
  const globalDispatch = (...args) => store.dispatch(...args)
  const createZealot = () => client
  store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {createZealot, globalDispatch}
        },
        serializableCheck: false,
        immutableCheck: false
      }),
    enhancers: (defaultEnhancers) => [
      applyDispatchAll(),
      ...defaultEnhancers,
      applyActionHistory()
    ]
  })
  return store
}

function applyDispatchAll() {
  return (createStore) => (...args) => {
    const store = createStore(...args)

    const dispatchAll = (actions: Action[]): State => {
      actions.forEach(store.dispatch)
      return store.getState()
    }

    return {
      ...store,
      dispatchAll
    }
  }
}

function applyActionHistory() {
  let actions = []
  return (createStore) => (...args) => {
    const store = createStore(...args)

    const dispatch = (...args) => {
      actions.push(args[0])
      return store.dispatch(...args)
    }

    const getActions = () => {
      return actions
    }

    const clearActions = () => {
      actions = []
    }

    return {
      ...store,
      dispatch,
      getActions,
      clearActions
    }
  }
}
