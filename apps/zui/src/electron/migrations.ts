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
  static all = Object.entries(migrationMap)
    .map(build)
    .sort((a, b) => a.version - b.version)

  static get latestVersion() {
    return last(this.all).version || 0
  }

  constructor(
    public currentVersion: number,
    public from: string | number,
    public to?: string | number
  ) {}

  static init(args: {from: string | number; to?: string | number} = {from: 0}) {
    const currentVersion = parseInt(args.from.toString())
    return new Migrations(currentVersion, args.from, args.to)
  }

  runPending(state: VersionedData) {
    return this.run(state, this.pending)
  }

  run(state: VersionedData, migrations: Migration[]) {
    for (const {version, migrate} of migrations) {
      state.data = state.data ? migrate(state.data) : undefined
      state.version = version
    }
    this.currentVersion = state.version
    return state
  }

  get pending() {
    const upperBound = this.to ? parseInt(this.to.toString()) : Infinity
    return Migrations.all.filter(
      (m: Migration) =>
        m.version > this.currentVersion && m.version <= upperBound
    )
  }

  get arePending() {
    return this.pending.length > 0
  }
}

function build(entry: [string, {default: (state: any) => any}]): Migration {
  const migrate = entry[1].default
  const version = parseInt(entry[0].replace("v", ""))

  return {migrate, version}
}
