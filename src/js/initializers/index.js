/* @flow */

import initBoom from "./initBoom"
import initDOM from "./initDOM"
import initMenuActionListeners from "./initMenuActionListeners"
import initPersistance from "./initPersistance"
import initQueryParams from "./initQueryParams"
import initShortcuts from "./initShortcuts"
import initState from "./initState"
import initStore from "./initStore"

export default () => {
  initDOM()
  const state = initState()
  const boom = initBoom(state)
  const store = initStore(state, boom)
  initPersistance(store)
  initShortcuts(store)
  initMenuActionListeners(store.dispatch)
  initQueryParams(store)
  return store
}
