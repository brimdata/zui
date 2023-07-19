import {migrate} from "src/test/unit/helpers/migrate"

test("migrating 202207270956_removeDraftQueries", async () => {
  const next = await migrate({state: "v0.30.0", to: "202207270956"})

  expect.assertions(1)
  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    expect(state.draftQueries).toBeUndefined()
  }
})
