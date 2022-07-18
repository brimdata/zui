import {pick} from "lodash"
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
  "queryVersions",
  "tabHistories",
  "lakes",
]

const TAB_PERSIST: TabKey[] = [
  "id",
  "search",
  "searchBar",
  "columns",
  "layout",
  "editor",
]

function deleteAccessTokens(state: Partial<State>) {
  if (!state.lakes) return
  for (const l of Object.values(state.lakes)) {
    if (l.authType === "auth0" && l.authData) delete l.authData.accessToken
  }
}

export function getPersistedState(original: State) {
  let state = pick(original, WINDOW_PERSIST)

  if (original.tabs) {
    const tabs = {
      ...original.tabs,
      data: original.tabs.data.map((tab) => pick(tab, TAB_PERSIST) as TabState),
    }
    state = {...state, tabs}
  }

  deleteAccessTokens(state)
  return state
}
