import {createSelector} from "reselect"
import {State} from "../types"
import {createIsEqualSelector} from "../utils"
import {findQuerySessionTab} from "./find"
import {activeTabsSelect, getActiveTabs} from "../Window/selectors"
import tab from "src/js/models/tab"
import Pools from "../Pools"
import Lakes from "../Lakes"
import Current from "../Current"
import Queries from "../Queries"

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

export const getTabModels = createSelector(
  getIds,
  Pools.raw,
  Lakes.raw,
  Current.getLakeId,
  Queries.getQueryIdToName,
  (ids, pools, lakes, lakeId, queryIdToName) => {
    return ids.map((id) => tab(id, lakes, pools, queryIdToName, lakeId))
  }
)
