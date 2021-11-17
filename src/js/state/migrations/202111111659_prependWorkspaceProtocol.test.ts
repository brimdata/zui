import {migrate} from "test/unit/helpers/migrate"
import {getAllStates} from "./utils/getTestState"

test("migrating 202111111659_prependWorkspaceProtocol", async () => {
  const next = await migrate({state: "v0.27.0", to: "202111111659"})

  expect.assertions(3)

  for (const state of getAllStates(next)) {
    Object.values(state.workspaces).forEach((w) => {
      // @ts-ignore
      expect(w.host.startsWith("http://")).toBe(true)
    })
  }
})
