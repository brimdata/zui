import {migrate} from "src/test/unit/helpers/migrate"
import {getAllRendererStates, getAllTabs} from "./utils/getTestState"

test("migrating 202307141454_moveSecondarySidebarState", async () => {
  const next = await migrate({state: "v1.1.0", to: "202307141454"})

  const renderer = getAllRendererStates(next)[0]
  expect(renderer.appearance.secondarySidebarWidth).toBe(260)
  expect(renderer.appearance.secondarySidebarIsOpen).toBe(true)

  for (const tab of getAllTabs(next)) {
    expect(tab.layout.rightSidebarIsOpen).toBe(undefined)
    expect(tab.layout.rightSidebarWidth).toBe(undefined)
  }
})
