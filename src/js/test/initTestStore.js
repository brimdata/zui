/* @flow */

import {createStore, compose, applyMiddleware} from "redux"
import reduxThunk from "redux-thunk"

import type {Action, State} from "../state/types"
import {createZealotMock} from "zealot"
import rootReducer from "../state/rootReducer"

type TestStore = {
  dispatch: Function,
  dispatchAll: Function,
  getActions: Function,
  getActionTypes: Function,
  clearActions: Function,
  getState: () => State
}

export default (zealot: * = createZealotMock()): TestStore => {
  let store

  // This is so that tests can use globalDispatch without actually making
  // electron ipc calls. In the tests, globalDispatch is an alias for dispatch.
  const globalDispatch = (...args) => store.dispatch(...args)

  const createZealot = () => zealot
  // $FlowFixMe
  store = createStore(
    rootReducer,
    undefined,
    compose(
      applyDispatchAll(),
      applyMiddleware(
        reduxThunk.withExtraArgument({
          zealot,
          createZealot,
          globalDispatch
        })
      ),
      applyActionHistory()
    )
  )
  // $FlowFixMe
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
