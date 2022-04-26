import {cloneDeep, pick} from "lodash"
import {TabState} from "./Tab/types"
import {State} from "./types"

type StateKey = keyof State
type TabKey = keyof TabState

const WINDOW_PERSIST: StateKey[] = [
  "appearance",
  "configPropValues",
  "investigation",
  "launches",
  "pluginStorage",
  "queries",
  "tabHistories",
  "tabs",
  "lakes",
]

const TAB_PERSIST: TabKey[] = ["id", "search", "searchBar", "columns", "layout"]

function deleteAccessTokens(state: Partial<State>) {
  if (!state.lakes) return
  for (const l of Object.values(state.lakes)) {
    if (l.authType === "auth0" && l.authData) delete l.authData.accessToken
  }
}

export function getPersistedState(original: State) {
  const clone = cloneDeep(original)
  const state = pick(clone, WINDOW_PERSIST)

  if (state.tabs) {
    state.tabs.data = state.tabs.data.map(
      (tab) => pick(tab, TAB_PERSIST) as TabState
    )
  }

  deleteAccessTokens(state)
  return state
}
