import {isObject} from "lodash"
import {migrate} from "src/test/unit/helpers/migrate"
import {getAllStates, getAllTabs} from "./utils/getTestState"

test("migrating 202302161437_addLayoutDefaults", async () => {
  const next = await migrate({
    state: "v0.30.0",
    to: "202302161437",
  })

  for (const tab of getAllTabs(next)) {
    // Add some defaults to layout
    expect(tab.layout.currentPaneName).toBe("history")
    expect(tab.layout.isEditingTitle).toBe(false)
    expect(tab.layout.titleFormAction).toBe("create")
    expect(tab.layout.showHistogram).toBe(true)
  }

  for (const s of getAllStates(next)) {
    if (!s.appearance || !isObject(s.appearance)) continue
    // Add some defaults to appearance
    expect(s.appearance.poolsOpenState).toEqual({})
    expect(s.appearance.queriesOpenState).toEqual({})
    // Remove sidebar sections
    expect(s.appearance.sidebarSections).not.toBeDefined()
  }
  //
  //   return state
})
