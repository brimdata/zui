/* @flow */

import pick from "lodash/pick"
import throttle from "lodash/throttle"

import type {State} from "../state/types"
import {deserialize, serialize} from "../serialization/serialization"

const KEY = "LOOKY_STATE.1"
const PERSIST = [
  "searchBar",
  "timeWindow",
  "boomd",
  "currentSpaceName",
  "view",
  "starredLogs",
  "tableColumnSets",
  "spaces",
  "investigation",
  "clusters"
]

export const saveState = (state: State) => {
  const toSave = pick(state, ...PERSIST) || {}
  const json = serialize(toSave)
  try {
    const serializedState = JSON.stringify(json)
    localStorage.setItem(KEY, serializedState)
  } catch (_err) {
    console.error("Unable to save the state")
  }
}

export const getState = () => {
  try {
    const serializedState = localStorage.getItem(KEY)
    if (
      typeof serializedState === "string" &&
      serializedState.startsWith("{")
    ) {
      const json = JSON.parse(serializedState)
      return deserialize(json)
    } else {
      return undefined
    }
  } catch (err) {
    console.error(err)
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
    }, 3000)
  )

  window.onbeforeunload = () => {
    saveState(store.getState())
  }
}

window.clearState = clearState
window.getState = getState
