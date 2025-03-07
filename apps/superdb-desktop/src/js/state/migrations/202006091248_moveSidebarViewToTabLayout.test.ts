import getTestState from "src/js/state/migrations/utils/getTestState"
import migrate from "./202006091248_moveSidebarViewToTabLayout"

test("migrating 202006091248_moveSidebarViewToTabLayout", () => {
  const prev = getTestState("v0.9.1")

  const next = migrate(prev)

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    for (const {layout} of state.tabs.data) {
      expect(layout.investigationView).toEqual("linear")
      expect(layout.leftSidebarIsOpen).toEqual(false)
      expect(layout.leftSidebarWidth).toEqual(350)
    }
  }
})
