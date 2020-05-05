/* @flow */

import pick from "lodash/pick"
import throttle from "lodash/throttle"

import type {State} from "../state/types"

export const VERSION = "8"

export function isCurrentVersion(state: *) {
  return state && state.version === VERSION
}

const KEY = "BRIM_STATE"
const PERSIST = [
  "tabs",
  "boomd",
  "currentSpaceName",
  "view",
  "starredLogs",
  "tableColumnSets",
  "spaces",
  "investigation",
  "clusters",
  "version",
  "logDetails"
]

export const saveState = (state: State) => {
  const json = pick(state, ...PERSIST) || {}

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
      if (json.version !== VERSION) {
        console.log(
          `New state version ${VERSION}. Dropping version ${json.version}`
        )
        return undefined
      } else {
        return json
      }
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
  global.store = store
  store.subscribe(
    throttle(() => {
      saveState(store.getState())
    }, 3000)
  )
}

global.clearState = clearState
