import {createSelector} from "reselect"
import {State} from "../types"
import {TabState} from "./types"
import {getActiveTabs} from "../LakeTabs/selectors"

const getActiveTab = createSelector(getActiveTabs, (tabs) => {
  const tab = tabs.data.find((t) => t.id === tabs.active)
  if (!tab) throw new Error("Can't find active tab")
  return tab
})

export default function activeTabSelect<T>(
  selector: (tabState: TabState, state: State) => T
): (state: State) => T {
  return createSelector(getActiveTab, (state) => state, selector)
}
