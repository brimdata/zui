import {getAllTabs} from "src/js/state/migrations/utils/getTestState"
import {migrate} from "src/test/unit/helpers/migrate"

test("migrating 202104291255_dropSpaces", async () => {
  const next = await migrate({state: "v0.24.0", to: "202104291255"})
  expect.assertions(3)

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    expect(state.spaces).toBe(undefined)
  }

  for (let tab of getAllTabs(next)) {
    expect(tab.layout.sidebarSections[0].id).toBe("pools")
  }
})
