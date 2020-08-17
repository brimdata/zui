/* @flow */

import {getAllStates} from "../../test/helpers/getTestState"

export default function moveDataFromSearchToCurrent(state: *) {
  for (const s of getAllStates(state)) {
    if (!s.tabs) continue
    for (const t of s.tabs.data) {
      t.current = {
        connectionId: t.search.clusterId,
        spaceId: t.search.spaceId
      }
      delete t.search.clusterId
      delete t.search.spaceId
    }
  }
  return state
}
