import {migrate} from "test/unit/helpers/migrate"
import {getAllStates} from "src/js/state/migrations/utils/getTestState"

test("migrating 202101291548_addAuthDefaultsToWorkspaces", async () => {
  expect.assertions(6)
  const next = await migrate({state: "v0.23.0", to: "202101291548"})

  for (const state of getAllStates(next)) {
    Object.values(state.lakes).forEach((l) =>
      // @ts-ignore
      expect(l.authType).toBeDefined()
    )
  }
})
