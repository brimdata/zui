import {migrate} from "test/unit/helpers/migrate"
import {getAllStates} from "src/js/state/migrations/utils/getTestState"

test("migrating 202101210823_renameToWorkspace", async () => {
  expect.assertions(16)
  const next = await migrate({state: "v0.21.1", to: "202101210823"})

  expect(next.globalState.lakes).toBeDefined()
  Object.values(next.globalState.lakes).forEach((c: any) => {
    expect(c.password).toBeUndefined()
    expect(c.username).toBeUndefined()
  })
  expect(next.globalState.clusters).toBeUndefined()
  for (const state of getAllStates(next)) {
    expect(state.clusters).toBeUndefined()
    if (!state.tabs) continue
    state.tabs.data.forEach((t) => {
      expect(t.current.connectionId).toBeUndefined()
      expect(t.current.lakeId).toBeDefined()
    })
  }
})
