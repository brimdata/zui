import {migrate} from "src/test/unit/helpers/migrate"

test("migrating 202407221450_populateSessions", async () => {
  const next = await migrate({state: "v1.17.0", to: "202407221450"})

  // expect(next).toBe)
})
