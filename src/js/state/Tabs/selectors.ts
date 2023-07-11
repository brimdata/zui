import {createSelector} from "reselect"
import {State} from "../types"
import {createIsEqualSelector} from "../utils"
import {findQuerySessionTab} from "./find"
import {activeTabsSelect, getActiveTabs} from "../LakeTabs/selectors"

export const getData = activeTabsSelect((tabs) => tabs.data)
export const getActive = activeTabsSelect((tabs) => tabs.active)
export const getCount = activeTabsSelect((tabs) => tabs.data.length)
export const getPreview = activeTabsSelect((tabs) => tabs.preview)
export const none = activeTabsSelect((tabs) => tabs.data.length === 0)

export const getActiveTab = createSelector(getActiveTabs, (tabs) => {
  const tab = tabs.data.find((t) => t.id === tabs.active)
  if (!tab) throw new Error("Can't find active tab")
  return tab
})

export const _getIds = createSelector(getData, (data) => {
  return data.map((d) => d.id)
})

export const getIds = createIsEqualSelector<State, string[], string[]>(
  _getIds,
  (ids) => ids
)

export const findFirstQuerySession = createSelector(
  getData,
  findQuerySessionTab
)

export const findById = (tabId: string) =>
  createSelector(getData, (tabs) => tabs.find((t) => t.id === tabId))
