import {migrate} from "test/unit/helpers/migrate"

test("migrating 202104281412_dropPacketsState", async () => {
  const next = await migrate({state: "v0.24.0", to: "202104281412"})
  expect.assertions(1)

  const windows = Object.values(next.windows)

  // @ts-ignore
  for (const {state} of windows) {
    expect(state).not.toHaveProperty("packets")
  }
})
