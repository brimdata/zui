import {zed} from "packages/zealot/src"
import activeTabSelect from "../Tab/activeTabSelect"
import {State} from "../types"
import {actions} from "./reducer"

export default {
  getStateForShape: (state: State, shape: zed.Type) =>
    activeTabSelect((tab) => tab.table.states.get(shape))(state),
  ...actions,
}
