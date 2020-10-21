import getTestState from "../../test/helpers/getTestState"
import migrate from "./202010191355_addConnectionNameDefault"

test("migrating 202010191355_addConnectionNameDefault", () => {
  const {data} = getTestState("v0.17.0")

  const next = migrate(data)

  const windowState = next.windows["7a2fd651bb"].state
  expect(windowState.clusters["localhost:9867"].name).toBe("localhost:9867")
})
