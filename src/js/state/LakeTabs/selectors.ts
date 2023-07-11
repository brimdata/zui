import {createSelector} from "reselect"
import {State} from "../types"
import {TabsState} from "../Tabs/types"

export const getActiveTabs = (state: State) =>
  state.lakeTabs.data[state.lakeTabs.active] ?? null

export function activeTabsSelect<T>(
  selector: (tabs: TabsState, state: State) => T
): (state: State) => T {
  return createSelector(getActiveTabs, (state) => state, selector)
}
