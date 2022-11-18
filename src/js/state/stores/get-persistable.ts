import {omit, pick} from "lodash"
import {TabState} from "../Tab/types"
import {State} from "../types"

type StateKey = keyof State
type TabKey = keyof TabState

export const GLOBAL_PERSIST: StateKey[] = [
  "launches",
  "lakes",
  "configs",
  "configPropValues",
  "pluginStorage",
  "queryVersions",
  "queries",
  "sessionQueries",
  "remoteQueries",
]

export const WINDOW_PERSIST: StateKey[] = [
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

export const TAB_PERSIST: TabKey[] = [
  "id",
  "search",
  "searchBar",
  "columns",
  "layout",
  "editor",
  "lastFocused",
]

export function getPersistedWindowState(original?: State) {
  if (!original) return
  return {
    ...pick(original, WINDOW_PERSIST),
    ...getPersistedLakes(original),
    ...getPersistedTabs(original),
    ...getPersistedTabHistories(),
  }
}

export function getPersistedGlobalState(original?: State) {
  if (!original) return
  return {
    ...pick(original, GLOBAL_PERSIST),
    ...getPersistedLakes(original),
  }
}

export function getPersistedTabs(original: State) {
  if (!original.tabs) return undefined
  const pickKeys = (tab) => pick(tab, TAB_PERSIST) as TabState
  return {
    tabs: {
      ...original.tabs,
      data: original.tabs.data.map(pickKeys),
    },
  }
}

function getPersistedLakes(state: Partial<State>) {
  if (!state.lakes) return undefined
  const newLakes = {}
  for (const id in state.lakes) {
    const lake = {...state.lakes[id]}
    if (lake.authData) {
      lake.authData = omit(lake.authData, "accessToken")
    }
    newLakes[id] = lake
  }
  return {lakes: newLakes}
}

function getPersistedTabHistories() {
  if (!global.tabHistories) return undefined
  return {
    tabHistories: toEntityState(global.tabHistories.serialize()),
  }
}

function toEntityState(items) {
  return items.reduce(
    (slice, entity) => {
      slice.ids.push(entity.id)
      slice.entities[entity.id] = entity
      return slice
    },
    {ids: [], entities: {}}
  )
}
