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
  expect(backup).toMatch(/^\d{12}_appState.json$/)
  const backupFile = path.join(backupDir, backup)
  expect(fsExtra.readJSONSync(backupFile)).toEqual(oldState)
})

test("app state is not backed up if no migration is needed", () => {
  init()
  expect(fsExtra.existsSync(backupDir)).toBe(false)
})
