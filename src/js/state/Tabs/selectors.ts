import {createSelector} from "reselect"
import {TabState} from "../Tab/types"
import {State} from "../types"
import {createIsEqualSelector} from "../utils"
import {TabsState} from "./types"
import {findQuerySessionTab} from "./find"

export const getData = (state: State) => state.tabs.data
export const getActive = (state: State) => state.tabs.active
export const getCount = (state: State) => state.tabs.data.length
export const getPreview = (state: State) => state.tabs.preview

export const getActiveTab = createSelector<State, TabsState, TabState>(
  (state) => state.tabs,
  (tabs) => {
    const tab = tabs.data.find((t) => t.id === tabs.active)
    if (!tab) throw new Error("Can't find active tab")
    return tab
  }
)

export const _getIds = createSelector(getData, (data) => {
  return data.map((d) => d.id)
})

export const getIds = createIsEqualSelector<State, string[], string[]>(
  _getIds,
  (ids) => ids
)

export const findFirstQuerySession = createSelector<
  State,
  TabState[],
  TabState
>((state) => state.tabs.data, findQuerySessionTab)

export const findById = (tabId: string) =>
  createSelector(getData, (tabs) => tabs.find((t) => t.id === tabId))
