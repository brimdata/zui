import {last} from "lodash"
import * as migrationMap from "src/js/state/migrations"

type Migration = {
  version: number
  migrate: Function
}

type VersionedData = {
  version: number
  data: any
}

export class Migrations {
  constructor(
    public migrations: Migration[],
    public cv: number,
    public from: string | number,
    public to?: string | number
  ) {}

  static async init(
    args: {from: string | number; to?: string | number} = {from: 0}
  ) {
    const cv = parseInt(args.from.toString())
    const migrations = Object.entries(migrationMap)
      .map(build)
      .sort((a, b) => a.version - b.version)

    return new Migrations(migrations, cv, args.from, args.to)
  }

  runPending(state: VersionedData) {
    return this.run(state, this.getPending())
  }

  run(state: VersionedData, migrations: Migration[]) {
    for (const {version, migrate} of migrations) {
      state.data = state.data ? migrate(state.data) : undefined
      state.version = version
    }
    return state
  }

  getLatestVersion() {
    return last(this.migrations).version || 0
  }

  getPending() {
    const upperBound = this.to ? parseInt(this.to.toString()) : Infinity
    return this.migrations.filter(
      (m: Migration) => m.version > this.cv && m.version <= upperBound
    )
  }

  getAll() {
    return this.migrations
  }

  setCurrentVersion(version: number) {
    this.cv = version
  }
}

function build(entry: [string, {default: (state: any) => any}]): Migration {
  const migrate = entry[1].default
  const version = parseInt(entry[0].replace("v", ""))

  return {migrate, version}
}
