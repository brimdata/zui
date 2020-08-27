/* @flow */

import getTestState from "../../test/helpers/getTestState"
import migrate from "./202008191031_changeZqdClusterIdToHostPort"

test("migrating 202008191031_changeZqdClusterIdToHostPort", () => {
  let {data} = getTestState("v0.15.1")

  let next = migrate(data)

  const windows = Object.values(next.windows)

  const oldId = "zqd"
  const newId = "localhost:9867"
  const newValue = {
    id: newId,
    host: "localhost",
    port: "9867"
  }

  // $FlowFixMe
  for (const {state} of windows) {
    expect(state.clusters[newId]).toEqual(newValue)
    expect(Object.keys(state.clusters)).not.toContain(oldId)
  }

  // $FlowFixMe
  const tabsData = windows.flatMap((win) => win.state.tabs.data)

  for (const td of tabsData) {
    if (!td.current) continue
    expect(td.current.connectionId).toBe(newId)
  }
})
