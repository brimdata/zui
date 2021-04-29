import {migrate} from "src/js/test/helpers/migrate"

test("migrating 202104291255_dropSpaces", async () => {
  const next = await migrate({state: "v0.24.0", to: "202104291255"})
  expect.assertions(2)

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    state.tabs.data.forEach((t) => {
      expect(t.spaces).toBe(undefined)
    })
  }
})
