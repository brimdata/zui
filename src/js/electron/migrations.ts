import path from "path"

import {last} from "src/js/lib/Array"
import lib from "src/js/lib"

const dir = path.join(__dirname, "../state/migrations")

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
    const files = await lib.file(dir).contents()
    const migrations = files
      .filter(onlyMigrations)
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

function onlyMigrations(file) {
  // only matching number then words then .ts
  return /\d{12}_\w+\.(ts|js)/.test(file)
}

function build(file): Migration {
  const migrate = require(path.join(dir, file)).default
  const [version] = file.replace(".js", "").replace(".ts", "").split("_")
  return {
    migrate,
    version: parseInt(version),
  }
}
