import {createSelector} from "reselect"
import {State} from "../types"
import {TabsState} from "../Tabs/types"

export const getActiveTabs = (state: State) => {
  const id = state.window.lakeId
  const tabs = state.window.tabs[id]
  if (!tabs) throw new Error("No Lake Tabs Found for Lake")
  return tabs
}

export function activeTabsSelect<T>(
  selector: (tabs: TabsState, state: State) => T
): (state: State) => T {
  return createSelector(getActiveTabs, (state) => state, selector)
}
