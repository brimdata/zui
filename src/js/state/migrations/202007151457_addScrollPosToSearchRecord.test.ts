import getTestState from "../../test/helpers/getTestState"
import migrate from "./202007151457_addScrollPosToSearchRecord"

test("migrating 202007151457_addScrollPosToSearchRecord", () => {
  const {data} = getTestState("v0.13.1")

  const next = migrate(data)

  const windows = Object.values(next.windows)

  for (const win of windows) {
    // @ts-ignore
    for (const tab of win.state.tabs.data) {
      expect(tab.viewer.scrollPos.x).toBe(0)
      expect(tab.viewer.scrollPos.y).toBe(0)
      expect(tab.viewer.scrollX).toBeUndefined()
      expect(tab.viewer.scrollY).toBeUndefined()
    }
  }
})
