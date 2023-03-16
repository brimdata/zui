import {zed} from "@brimdata/zealot"
import activeTabSelect from "../Tab/activeTabSelect"
import {State} from "../types"
import {actions} from "./reducer"

export default {
  getStateForShape: (state: State, shape: zed.Type) =>
    activeTabSelect((tab) => tab.table.states.get(shape))(state),
  getScrollPosition: activeTabSelect((tab) => tab.table.scrollPosition),
  ...actions,
}
