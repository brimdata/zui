import {Migrations} from "./migrations"

test("run", () => {
  const migrations = Migrations.init({from: 0})
  const state = {version: 0, data: undefined}

  const newState = migrations.run(state, migrations.pending)

  expect(newState.version).toEqual(Migrations.latestVersion)
})

test("sorts the migrations by version", async () => {
  const versions = Migrations.all.map((m) => m.version)
  const sorted = versions.slice().sort((a, b) => a - b)

  expect(versions).toEqual(sorted)
})

test("run pending", async () => {
  const migrations = await Migrations.init()
  const state = {version: 0, data: undefined}

  const newState = migrations.runPending(state)

  expect(newState.version).toEqual(Migrations.latestVersion)
})

test("only migration march migrations", async () => {
  const migrations = await Migrations.init({
    from: "202010191355",
    to: "202011141516",
  })
  // expect(migrations.getPending()).toHaveLength(3)
  expect(migrations.pending.map((m) => m.version)).toEqual([
    202011060944, // remove cluster status
    202011141515, // add suricata runner
    202011141516, // add suricata updater
  ])
})
