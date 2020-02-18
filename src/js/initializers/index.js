/* @flow */

import initBoom from "./initBoom"
import initDOM from "./initDOM"
import initMainStore from "./initMainStore"
import initMenuActionListeners from "./initMenuActionListeners"
import initPersistance from "./initPersistance"
import initQueryParams from "./initQueryParams"
import initShortcuts from "./initShortcuts"
import initState from "./initState"
import initStore from "./initStore"

export default () => {
  initDOM()
  const _state = initState()
  const boom = initBoom(undefined)
  const store = initStore(undefined, boom)
  initPersistance(store)
  initShortcuts(store)
  initMenuActionListeners(store.dispatch)
  initQueryParams(store)
  initMainStore()
  return store
}
