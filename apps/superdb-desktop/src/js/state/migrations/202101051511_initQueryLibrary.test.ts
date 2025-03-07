import {migrate} from "src/test/unit/helpers/migrate"
import {getAllStates} from "src/js/state/migrations/utils/getTestState"

test("migrating 202101051511_initQueryLibrary", async () => {
  const next = await migrate({state: "v0.21.1", to: "202101051511"})

  for (const state of getAllStates(next)) {
    expect(state.queries).toBe(undefined)
  }
})
