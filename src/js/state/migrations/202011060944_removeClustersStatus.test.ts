import getTestState from "../../test/helpers/getTestState"
import migrate from "./202011060944_removeClustersStatus"

test("migrating 202011060944_removeClustersStatus", () => {
  const {data} = getTestState("v0.17.0")
  const next = migrate(data)

  const windows = Object.values(next.windows)

  // @ts-ignore
  for (const {state} of windows) {
    Object.values(state.clusters).forEach((c) => {
      expect(c).not.toHaveProperty("status")
    })
  }
})
