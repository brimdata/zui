import tron from "./"

test("run", async () => {
  const migrations = await tron.migrations(0)
  const state = {version: 0, data: undefined}

  const newState = migrations.run(state, migrations.getPending())

  expect(newState.version).toEqual(migrations.getLatestVersion())
})

test("sorts the migrations by version", async () => {
  const migrations = await tron.migrations(0)
  const versions = migrations.getAll().map((m) => m.version)
  const sorted = versions.slice().sort((a, b) => a - b)

  expect(versions).toEqual(sorted)
})

test("run pending", async () => {
  const migrations = await tron.migrations(0)
  const state = {version: 0, data: undefined}

  const newState = migrations.runPending(state)

  expect(newState.version).toEqual(migrations.getLatestVersion())
})
