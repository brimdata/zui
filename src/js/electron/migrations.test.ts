import {Migrations} from "./migrations"

test("run", async () => {
  const migrations = await Migrations.init({from: 0})
  const state = {version: 0, data: undefined}

  const newState = migrations.run(state, migrations.getPending())

  expect(newState.version).toEqual(migrations.getLatestVersion())
})

test("sorts the migrations by version", async () => {
  const migrations = await Migrations.init()
  const versions = migrations.getAll().map((m) => m.version)
  const sorted = versions.slice().sort((a, b) => a - b)

  expect(versions).toEqual(sorted)
})

test("run pending", async () => {
  const migrations = await Migrations.init()
  const state = {version: 0, data: undefined}

  const newState = migrations.runPending(state)

  expect(newState.version).toEqual(migrations.getLatestVersion())
})

test("only migration march migrations", async () => {
  const migrations = await Migrations.init({
    from: "202010191355",
    to: "202011141515",
  })
  expect(migrations.getPending()).toHaveLength(3)
  expect(migrations.getPending().map((m) => m.version)).toEqual([
    202011060944, // remove cluster status
    202011141515, // add suricata runner
    202011141515, // add suricata updater
  ])
})
