import {migrate} from "src/test/unit/helpers/migrate"

test("migrating 202409271055_migrateToSnapshots", async () => {
  const _next = await migrate({state: "v1.18.0", to: "202409271055"})
  /* Create the assertions here */
})
