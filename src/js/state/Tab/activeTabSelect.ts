import {createSelector} from "@reduxjs/toolkit"
import {TabsState} from "../Tabs/types"
import {State} from "../types"
import {TabState} from "./types"

const getActiveTab = createSelector<State, TabsState, TabState>(
  (state) => state.tabs,
  (tabs) => {
    const tab = tabs.data.find((t) => t.id === tabs.active)
    if (!tab) throw new Error("Can't find active tab")
    return tab
  }
)

export default function activeTabSelect<T>(
  selector: (tabState: TabState, state: State) => T
): (state: State) => T {
  return createSelector<State, TabState, State, T>(
    getActiveTab,
    (state) => state,
    selector
  )
}
