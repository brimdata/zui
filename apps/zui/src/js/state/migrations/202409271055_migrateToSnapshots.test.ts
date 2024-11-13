import {migrate} from "src/test/unit/helpers/migrate"

test("migrating 202409271055_migrateToSnapshots", async () => {
  const next = await migrate({
    state: "v1.18.0-b61d012",
    to: "202409271055",
  })
  /* Create the assertions here */
})
