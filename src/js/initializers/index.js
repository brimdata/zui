/* @flow */

import initBoom from "./initBoom"
import initMenuActionListeners from "./initMenuActionListeners"
import initPersistance from "./initPersistance"
import initShortcuts from "./initShortcuts"
import initState from "./initState"
import initStore from "./initStore"

export default () => {
  const state = initState()
  const boom = initBoom(state)
  const store = initStore(state, boom)
  initPersistance(store)
  initShortcuts(store)
  initMenuActionListeners(store.dispatch)
  return store
}
