/* @flow */

import initBoom from "./initBoom"
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
  return store
}
