/* @flow */

import type {State} from "../types"

export default {
  getJSONTypeConfig: (state: State) => state.prefs.jsonTypeConfig,
  getTimeFormat: (state: State) => state.prefs.timeFormat
}
