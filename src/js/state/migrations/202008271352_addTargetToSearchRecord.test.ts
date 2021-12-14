import {migrate} from "test/unit/helpers/migrate"

test("migrating 202008271352_addTargetToSearchRecord", async () => {
  const next = await migrate({state: "v0.15.1", to: "202008271352"})

  expect(true).toBe(true)
  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    state.investigation.forEach((finding) => {
      expect(finding.search.target).toBe("events")
    })

    state.tabs.data.forEach((t) => {
      t.history.entries.forEach((e) => {
        expect(e.target).toBe("events")
      })
    })
  }
})
