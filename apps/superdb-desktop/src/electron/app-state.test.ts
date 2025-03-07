/**
 * @jest-environment jsdom
 */

import fsExtra from "fs-extra"

import path from "path"
import os from "os"

import disableLogger from "src/test/unit/helpers/disableLogger"
import {Migrations} from "./migrations"
import {AppState} from "./app-state"
import states from "src/test/unit/states"

const dir = path.join(os.tmpdir(), "session.test.ts")
const file = path.join(dir, "appState.json")
const backupDir = path.join(dir, "backups")

disableLogger()
beforeEach(() => fsExtra.ensureDir(dir))
afterEach(() => fsExtra.remove(dir))

function init() {
  return new AppState({path: file, backupDir})
}

test("app state file that doesn't exist", () => {
  expect(fsExtra.existsSync(file)).toBe(false)
  const appState = init()
  expect(appState.data).toEqual(undefined)
  expect(appState.version).toEqual(Migrations.latestVersion)
})

test("app state file that is empty", () => {
  fsExtra.createFileSync(file)
  const appState = init()
  expect(appState.data).toEqual(undefined)
  expect(appState.version).toEqual(Migrations.latestVersion)
})

test("app state file that does not parse to JSON", () => {
  fsExtra.writeFileSync(file, "---\nthis_is_yaml: true\n---")
  expect(fsExtra.existsSync(file)).toBe(true)
  expect(() => {
    init()
  }).toThrow(/The application state file could not be parsed as JSON/)
})

test("app state file that is JSON but has not version number", async () => {
  const v8 = {
    order: [],
    windows: {},
    globalState: {investigation: [], pools: {zqd: {}}, version: "6"},
  }
  fsExtra.writeJSONSync(file, v8)

  expect(() => {
    init()
  }).toThrow(
    /The application state file is a JSON object but is missing the top-level version key of type number/
  )
})

test("app state is migrated if migrations are pending", () => {
  const needsMigration = states.getPath("v1.18.0.json")
  const oldState = fsExtra.readJSONSync(needsMigration)
  expect(oldState.version).not.toEqual(Migrations.latestVersion)

  fsExtra.cpSync(needsMigration, file)
  const appState = init()

  expect(appState.version).toBe(Migrations.latestVersion)
})

test("app state is backed if migration is needed", () => {
  const needsMigration = states.getPath("v1.18.0.json")
  const oldState = fsExtra.readJSONSync(needsMigration)
  fsExtra.cpSync(needsMigration, file)
  init()
  expect(fsExtra.existsSync(backupDir)).toBe(true)
  const backup = fsExtra.readdirSync(backupDir)[0]
  expect(backup).toMatch(/^\d{12}_backup.json$/)
  const backupFile = path.join(backupDir, backup)
  expect(fsExtra.readJSONSync(backupFile)).toEqual(oldState)
})

test("app state is not backed up if no migration is needed", () => {
  init()
  expect(fsExtra.existsSync(backupDir)).toBe(true)
  expect(fsExtra.readdirSync(backupDir)).toEqual([])
})

test("backing up the same version twice creates distict backups", () => {
  fsExtra.cpSync(states.getPath("v1.18.0.json"), file)
  init()
  expect(fsExtra.readdirSync(backupDir)).toEqual(["202407221450_backup.json"])
  fsExtra.cpSync(states.getPath("v1.18.0.json"), file)
  init()
  expect(fsExtra.readdirSync(backupDir)).toEqual([
    "202407221450_backup.json",
    "202407221450_backup_2.json",
  ])
  fsExtra.cpSync(states.getPath("v1.18.0.json"), file)
  init()
  expect(fsExtra.readdirSync(backupDir)).toEqual([
    "202407221450_backup.json",
    "202407221450_backup_2.json",
    "202407221450_backup_3.json",
  ])
})

test("a migration error does not affect the state file", () => {
  const fixture = states.getPath("v1.18.0.json")
  fsExtra.cpSync(fixture, file)
  Migrations.all.push({
    version: 9999_99_99_99_99,
    migrate: (bang) => bang.boom.boom,
  })
  expect(() => {
    init()
  }).toThrow(/Cannot read properties of undefined \(reading 'boom'\)/)
  Migrations.all.pop()
  expect(fsExtra.readJSONSync(file)).toEqual(fsExtra.readJSONSync(fixture))
})

test("app state saves new data", () => {
  const appState = init()
  appState.save({hello: "test"})

  expect(fsExtra.readJSONSync(file)).toEqual({
    version: Migrations.latestVersion,
    data: {hello: "test"},
  })
  expect(appState.data).toEqual({hello: "test"})
  expect(appState.version).toEqual(Migrations.latestVersion)
})

test("app state reset", () => {
  const appState = init()
  appState.save({hello: "test"})

  appState.reset()
  expect(fsExtra.readJSONSync(file)).toEqual({
    version: Migrations.latestVersion,
  })
})
