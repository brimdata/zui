import {migrate} from "test/unit/helpers/migrate"

test("migrating 202202170834_resetInvestigationsAndTabHistories", async () => {
  const next = await migrate({state: "v0.27.0", to: "202202170834"})

  expect.assertions(5)

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    expect(state.investigation).toBe(undefined)
    expect(state.tabHistories).toBe(undefined)
  }

  expect(next.globalState.investigation).toBe(undefined)
})
