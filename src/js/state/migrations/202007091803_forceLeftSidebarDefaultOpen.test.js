/* @flow */

import getTestState from "../../test/helpers/getTestState"
import migrate from "./202007091803_forceLeftSidebarDefaultOpen"

test("migrating 202007091803_forceLeftSidebarDefaultOpen", () => {
  const {data} = getTestState("v0.12.0")

  const next = migrate(data)

  const windows = Object.values(next.windows)

  for (const win of windows) {
    // $FlowFixMe
    for (const tab of win.state.tabs.data) {
      expect(tab.layout.leftSidebarIsOpen).toBe(true)
      expect(tab.layout.leftSidebarWidth).toBe(230)
    }
  }
})
