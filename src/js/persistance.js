import pick from "lodash/pick"

const KEY = "LOOKY_STATE"
const PERSIST = [
  "filterTree",
  "sideBar",
  "descriptors",
  "searchBar",
  "timeWindow",
  "currentSpaceName",
  "boomdCredentials",
  "boomdConnection",
  "view",
  "starredLogs"
]

export function saveState(state) {
  try {
    const serializedState = JSON.stringify(pick(state, ...PERSIST))
    localStorage.setItem(KEY, serializedState)
  } catch (_err) {
    console.error("Unable to save the state")
  }
}

export function loadState() {
  try {
    const serializedState = localStorage.getItem(KEY)
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState)
  } catch (_err) {
    return undefined
  }
}

export function clearState() {
  try {
    localStorage.setItem(KEY, undefined)
  } catch (_err) {
    console.error("Unable to clear the state")
  }
}
