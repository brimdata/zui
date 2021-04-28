import {configureStore} from "@reduxjs/toolkit"
import {createZealotMock, Zealot} from "zealot"
import initGlobals from "../initializers/initGlobals"
import rootReducer from "../state/rootReducer"
import {Action, State} from "../state/types"
import BrimApi from "../api"

export type TestStore = {
  dispatch: Function
  dispatchAll: Function
  getActions: Function
  getActionTypes: Function
  clearActions: Function
  getState: () => State
}

export default (zealot?: Zealot, api?: BrimApi): TestStore => {
  const client = zealot || createZealotMock().zealot
  const createZealot = () => client
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {createZealot, api}
        },
        serializableCheck: false,
        immutableCheck: false
      }),
    enhancers: (defaultEnhancers) => [
      applyDispatchAll(),
      ...defaultEnhancers,
      applyActionHistory()
    ]
  }) as any
  initGlobals(store)
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
