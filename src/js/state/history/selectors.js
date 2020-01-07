/* @flow */

import type {State} from "../types"
import brim from "../../brim"

export default {
  current: (state: State) => state.history.entries[state.history.position],
  canGoBack: (state: State) => brim.entries(state.history).canGoBack(),
  canGoForward: (state: State) => brim.entries(state.history).canGoForward()
}
