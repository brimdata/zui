/* @flow */

import initState from "./state"
import initStore from "./store"
import initApi from "./api"
import initShortcuts from "./shortcuts"
import initPersistance from "./persistance"

export default () => {
  const state = initState()
  const api = initApi(state)
  const store = initStore(state, api)
  initPersistance(store)
  initShortcuts(store)
  return store
}
