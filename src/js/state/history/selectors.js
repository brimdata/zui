/* @flow */

import type {TabState} from "../tab/types"
import brim from "../../brim"

export default {
  prev: (state: TabState) => state.history.entries[state.history.position - 1],
  current: (state: TabState) => state.history.entries[state.history.position],
  canGoBack: (state: TabState) => brim.entries(state.history).canGoBack(),
  canGoForward: (state: TabState) => brim.entries(state.history).canGoForward()
}
