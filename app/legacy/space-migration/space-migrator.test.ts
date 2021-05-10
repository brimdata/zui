import SpaceMigrator from "./space-migrator"

test("space migrator", () => {
  const spaces = new SpaceMigrator(
    "/Users/jkerr/Library/Application Support/Brim/data/spaces",
    "/Users/jkerr/work/brimcap-root"
  )

  expect(spaces.needMigration()).toBe(true)
})

test("no dir", () => {
  const spaces = new SpaceMigrator(
    "/nope/nope/nope",
    "/Users/jkerr/work/brimcap-root"
  )

  expect(spaces.needMigration()).toBe(false)
})

test("no sp_ folders", () => {
  const spaces = new SpaceMigrator(
    "/Users/jkerr/work",
    "/Users/jkerr/work/brimcap-root"
  )

  expect(spaces.needMigration()).toBe(false)
})

test("run it", async () => {
  const spaces = new SpaceMigrator(
    "/Users/jkerr/work/brim/run/data/spaces",
    "/Users/jkerr/work/brimcap-root"
  )

  await spaces.migrate((update) => {
    console.log(update)
  })
})
