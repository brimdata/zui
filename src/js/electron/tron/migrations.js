/* @flow */
import path from "path"

import {last} from "../../lib/Array"
import lib from "../../lib"

let dir = path.join(__dirname, "../../state/migrations")

type Migration = {
  version: number,
  migrate: Function
}

type VersionedData = {
  version: number,
  data: *
}

export type Migrations = {
  runPending: (*) => *,
  run: (VersionedData, Migration[]) => VersionedData,
  getLatestVersion: () => number,
  getPending: () => Migration[],
  getAll: () => Migration[]
}

export default async function migrations(
  currentVersion: string | number = 0
): Promise<Migrations> {
  let cv = parseInt(currentVersion)
  // $FlowFixMe
  let files = await lib.file(dir).contents()
  let migrations = files
    .filter(excludeTests)
    .map(build)
    .sort((a, b) => a.version - b.version)

  return {
    runPending(state: VersionedData) {
      return this.run(state, this.getPending())
    },

    run(state: VersionedData, migrations: Migration[]) {
      for (let {version, migrate} of migrations) {
        state.data = migrate(state.data)
        state.version = version
      }
      return state
    },

    getLatestVersion() {
      return last(migrations).version || 0
    },

    getPending() {
      return migrations.filter<Migration>((m) => parseInt(m.version) > cv)
    },

    getAll() {
      return migrations
    },

    setCurrentVersion(version: number) {
      cv = version
    }
  }
}

function excludeTests(file) {
  return !/\.test\.js/.test(file)
}

function build(file): Migration {
  // $FlowFixMe
  let migrate = require(path.join(dir, file)).default
  let [version, name] = file.replace(".js", "").split("_")
  return {
    migrate,
    name,
    version: parseInt(version)
  }
}
