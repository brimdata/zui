import {omit, pick} from "lodash"
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
  "sessionHistories",
  "sessionQueries",
  "lakes",
]

const TAB_PERSIST: TabKey[] = [
  "id",
  "search",
  "searchBar",
  "columns",
  "layout",
  "editor",
  "lastFocused",
  "lastLocationKey",
]

function deleteAccessTokens(state: Partial<State>) {
  if (!state.lakes) return undefined
  const newLakes = {}
  for (const id in state.lakes) {
    const lake = {...state.lakes[id]}
    if (lake.authData) {
      lake.authData = omit(lake.authData, "accessToken")
    }
    newLakes[id] = lake
  }
  return newLakes
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
  const lakes = deleteAccessTokens(state)
  state = {...state, lakes}
  return state
}
