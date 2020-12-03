import getTestState from "../../test/helpers/getTestState"
import migrate from "./202012021127_addQuerySection"

test("migrating 202012021127_addQuerySection", () => {
  let {data} = getTestState("v0.20.0")

  let next = migrate(data)

  const windows = Object.values(next.windows)
  // @ts-ignore
  for (const {state} of windows) {
    for (const tab of state.tabs.data) {
      expect(tab.layout.sidebarSections.map((s) => s.id)).toEqual([
        "spaces",
        "queries",
        "history"
      ])
    }
  }
})
