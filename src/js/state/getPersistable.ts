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
  "workspaces"
]

const TAB_PERSIST: TabKey[] = ["id", "search", "searchBar", "columns", "layout"]

function deleteAccessTokens(state: Partial<State>) {
  if (!state.workspaces) return
  for (const ws of Object.values(state.workspaces)) {
    if (ws.authType === "auth0" && ws.authData) delete ws.authData.accessToken
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
