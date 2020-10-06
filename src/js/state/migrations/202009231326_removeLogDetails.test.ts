import getTestState from "../../test/helpers/getTestState"
import migrate from "./202009231326_removeLogDetails"

test("migrating 202009231326_removeLogDetails", () => {
  const {data} = getTestState("v0.15.1")

  const next = migrate(data)

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    state.tabs.data.forEach((t) => {
      expect(t.logDetails).toBe(undefined)
    })
  }
})
