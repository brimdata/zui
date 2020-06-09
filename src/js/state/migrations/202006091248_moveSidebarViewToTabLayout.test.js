/* @flow */

import getTestState from "../../test/helpers/getTestState"
import migrate from "./202006091248_moveSidebarViewToTabLayout"

test("migrating 202006091248_moveSidebarViewToTabLayout", () => {
  let prev = getTestState("v0.9.1")

  let next = migrate(prev)
  for (const win of Object.values(next.windows)) {
    for (const {layout} of win.state.tabs.data) {
      expect(layout.investigationView).toEqual("linear")
      expect(layout.leftSidebarIsOpen).toEqual(false)
      expect(layout.leftSidebarWidth).toEqual(350)
    }
  }
})
