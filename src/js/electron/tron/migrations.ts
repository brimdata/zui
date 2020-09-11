import path from "path"

import {last} from "../../lib/Array"
import lib from "../../lib"

const dir = path.join(__dirname, "../../state/migrations")

type Migration = {
  version: number
  migrate: Function
}

type VersionedData = {
  version: number
  data: any
}

export type Migrations = {
  runPending: (arg0: any) => any
  run: (arg0: VersionedData, arg1: Migration[]) => VersionedData
  getLatestVersion: () => number
  getPending: () => Migration[]
  getAll: () => Migration[]
  setCurrentVersion: (arg0: number) => void
}

export default async function migrations(
  currentVersion: string | number = 0
): Promise<Migrations> {
  let cv = parseInt(currentVersion.toString())
  // $FlowFixMe
  const files = await lib.file(dir).contents()
  const migrations = files
    .filter(excludeTests)
    .map(build)
    .sort((a, b) => a.version - b.version)

  return {
    runPending(state: VersionedData) {
      return this.run(state, this.getPending())
    },

    run(state: VersionedData, migrations: Migration[]) {
      for (const {version, migrate} of migrations) {
        state.data = migrate(state.data)
        state.version = version
      }
      return state
    },

    getLatestVersion() {
      return last(migrations).version || 0
    },

    getPending() {
      return migrations.filter((m: Migration) => m.version > cv)
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
  return !/\.test\.(ts|js)/.test(file)
}

function build(file): Migration {
  // $FlowFixMe
  const migrate = require(path.join(dir, file)).default
  const [version] = file
    .replace(".js", "")
    .replace(".ts", "")
    .split("_")
  return {
    migrate,
    version: parseInt(version)
  }
}
