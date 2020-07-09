/* @flow */

import getTestState from "../../test/helpers/getTestState"
import migrate from "./202007081719_addScrollXyToViewer"

test("migrating 202007081719_addScrollXyToViewer", () => {
  let {data} = getTestState("v0.12.0")

  const next = migrate(data)

  const windows = Object.values(next.windows)

  for (const win of windows) {
    // $FlowFixMe
    for (const tab of win.state.tabs.data) {
      expect(tab.viewer.scrollX).toBe(0)
      expect(tab.viewer.scrollY).toBe(0)
    }
  }
})
