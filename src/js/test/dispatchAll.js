/* @flow */

export default (store: *, actions: Object[]) => {
  actions.forEach(store.dispatch)
  return store.getState()
}
