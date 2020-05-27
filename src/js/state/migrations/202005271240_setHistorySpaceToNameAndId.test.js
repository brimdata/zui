/* @flow */

import getTestState from "../../test/helpers/getTestState"
import migrate from "./202005271240_setHistorySpaceToNameAndId"
import {cloneDeep} from "lodash"

const getTabHistoryEntries = (state) => {
  return state.tabs.data.map((t) => t.history.entries)
}

test("migrating 202005271240_setHistorySpaceToNameAndId", () => {
  const prev = getTestState("v0.9.1")
  const next = migrate(cloneDeep(prev))

  for (const [nextK, nextV] of Object.entries(next.windows)) {
    // $FlowFixMe
    const nextEntries = getTabHistoryEntries(nextV.state)
    const prevEntries = getTabHistoryEntries(prev.windows[nextK].state)

    prevEntries.forEach((ents) => {
      ents.forEach((e) => {
        const oldName = e.space
        e.spaceName = oldName
        e.spaceId = oldName
        delete e.space
      })
    })

    expect(nextEntries).toEqual(prevEntries)
  }
})
