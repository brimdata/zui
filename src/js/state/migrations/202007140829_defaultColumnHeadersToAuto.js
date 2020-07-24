/* @flow */

import {getAllStates} from "../../test/helpers/getTestState"

export default function defaultColumnHeadersToAuto(state: *) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const tab of s.tabs.data) {
      tab.layout.columnHeadersView = "AUTO"
    }
  }

  return state
}
