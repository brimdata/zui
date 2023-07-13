import {omit, pick} from "lodash"
import {TabState} from "../Tab/types"
import {State} from "../types"
import {TabsState} from "../Tabs/types"

type StateKey = keyof State
type TabKey = keyof TabState

export const GLOBAL_PERSIST: StateKey[] = [
  "configPropValues",
  "lakes",
  "launches",
  "queries",
  "queryVersions",
  "remoteQueries",
  "sessionQueries",
  "poolSettings",
]

export const WINDOW_PERSIST: StateKey[] = [
  "appearance",
  "sessionHistories",
  "tabHistories",
  "window",
]

export const TAB_PERSIST: TabKey[] = ["editor", "id", "lastFocused", "layout"]

export function getPersistedWindowState(original?: State) {
  if (!original) return
  return {
    ...pick(original, WINDOW_PERSIST),
    ...getPersistedLakeTabs(original),
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

export function getPersistedLakeTabs(original?: State) {
  if (!original) return undefined
  const tabs = {}
  for (const id in original.window.tabs) {
    tabs[id] = getPersistedTabs(original.window.tabs[id])
  }
  return {
    window: {
      ...original.window,
      tabs,
    },
  }
}

export function getPersistedTabs(tabs: TabsState) {
  if (!tabs) return undefined
  const pickKeys = (tab) => pick(tab, TAB_PERSIST) as TabState
  return {
    ...tabs,
    data: tabs.data.map(pickKeys),
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
