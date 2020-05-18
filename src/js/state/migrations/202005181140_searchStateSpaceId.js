/* @flow */

import {getAllStates} from "../../test/helpers/getTestState"

export default function searchStateSpaceId(state: *) {
  for (let s of getAllStates(state)) {
    if (!s.tabs) continue

    for (let tab of s.tabs.data) {
      let oldName = tab.search.space
      tab.search.spaceName = oldName
      tab.search.spaceId = oldName
      delete tab.search.space
    }
  }

  return state
}
