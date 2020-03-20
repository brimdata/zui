/* @flow */

import {createStore, compose, applyMiddleware} from "redux"
import reduxThunk from "redux-thunk"

import type {Action, State} from "../state/types"
import MockBoomClient from "./MockBoomClient"
import rootReducer from "../state/rootReducer"

type TestStore = {
  dispatch: Function,
  dispatchAll: Function,
  getActions: Function,
  getActionTypes: Function,
  clearActions: Function,
  getState: () => State
}

export default (boom: * = new MockBoomClient().stub("send")): TestStore => {
  // $FlowFixMe
  return createStore(
    rootReducer,
    undefined,
    compose(
      applyDispatchAll(),
      applyMiddleware(reduxThunk.withExtraArgument(boom)),
      applyActionHistory()
    )
  )
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
