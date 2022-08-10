import {initialize} from "../initializers/couriers"

test("initialize runs the couriers", async () => {
  const count = await initialize(undefined)

  expect(count).toBeGreaterThan(0)
})
