import {createSelector} from "reselect"
import {TabState} from "../Tab/types"
import {State} from "../types"
import {createIsEqualSelector} from "../utils"
import {TabsState} from "./types"

const getData = (state: State) => state.tabs.data
const getActive = (state: State) => state.tabs.active
const getCount = (state: State) => state.tabs.data.length

const getActiveTab = createSelector<State, TabsState, TabState>(
  (state) => state.tabs,
  (tabs) => {
    const tab = tabs.data.find((t) => t.id === tabs.active)
    if (!tab) throw new Error("Can't find active tab")
    return tab
  }
)

const _getIds = createSelector(getData, (data) => {
  return data.map((d) => d.id)
})

const getIds = createIsEqualSelector(_getIds, (ids) => ids)

export default {
  getData,
  getActive,
  getCount,
  getActiveTab,
  getIds,
}
