import {runInitializers} from "./run-initializers"

test("it runs the initializers", async () => {
  const count = await runInitializers(undefined)

  expect(count).toBeGreaterThan(0)
})
