/* @flow */

import {createStore, compose, applyMiddleware} from "redux"
import reduxThunk from "redux-thunk"
import reducer from "../reducers"

export default (api: *) =>
  createStore(
    reducer,
    undefined,
    compose(
      applyMiddleware(reduxThunk.withExtraArgument(api)),
      actionHistory
    )
  )

const actionHistory = createStore => (...args) => {
  const store = createStore(...args)
  let actions = []
  const getActions = () => actions
  const clearActions = () => (actions = [])

  const dispatch = action => {
    actions.push(action)
    store.dispatch(action)
  }

  const dispatchAll = (actions: Object[]) => {
    actions.forEach(store.dispatch)
    return store.getState()
  }

  return {
    ...store,
    dispatch,
    dispatchAll,
    getActions,
    clearActions
  }
}
