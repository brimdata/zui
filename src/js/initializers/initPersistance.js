/* @flow */

import pick from "lodash/pick"
import throttle from "lodash/throttle"
import type {State} from "../reducers/types"

const KEY = "LOOKY_STATE.1"
const PERSIST = [
  "filterTree",
  "searchBar",
  "timeWindow",
  "boomd",
  "currentSpaceName",
  "view",
  "starredLogs",
  "tableColumnSets",
  "spaces"
]

export const saveState = (state: State) => {
  try {
    const serializedState = JSON.stringify(pick(state, ...PERSIST))
    localStorage.setItem(KEY, serializedState)
  } catch (_err) {
    console.error("Unable to save the state")
  }
}

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(KEY)
    if (typeof serializedState === "string") {
      return JSON.parse(serializedState)
    } else {
      return undefined
    }
  } catch (_err) {
    return undefined
  }
}

export const clearState = () => {
  try {
    localStorage.setItem(KEY, "")
  } catch (_err) {
    console.error("Unable to clear the state")
  }
}

export default (store: *) => {
  store.subscribe(
    throttle(() => {
      saveState(store.getState())
    }, 1000)
  )
}
