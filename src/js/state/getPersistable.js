/* @flow */
export default function getPersistable(state: *) {
  let persist = Object.assign({}, state)
  // remove state pieces which we are not interested in persisting
  delete persist.errors
  delete persist.notice
  delete persist.handlers
  delete persist.spaces

  return persist
}
