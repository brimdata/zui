/* @flow */

import {createStore, compose, applyMiddleware} from "redux"
import reduxThunk from "redux-thunk"
import reducer from "../reducers"

type TestStore = {
  dispatch: Function,
  dispatchAll: Function,
  getActions: Function,
  clearActions: Function,
  getState: Function
}

export default (api: *): TestStore =>
  // $FlowFixMe
  createStore(
    reducer,
    undefined,
    compose(
      applyDispatchAll(),
      applyMiddleware(reduxThunk.withExtraArgument(api)),
      applyActionHistory()
    )
  )

function applyDispatchAll() {
  return createStore => (...args) => {
    const store = createStore(...args)

    const dispatchAll = actions => {
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
  return createStore => (...args) => {
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
