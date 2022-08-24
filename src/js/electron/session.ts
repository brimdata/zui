import log from "electron-log"
import {get} from "lodash"
import lib from "src/js/lib"
import {isNumber} from "src/js/lib/is"
import {Migrations} from "./migrations"
import {SessionState} from "./session-state"

export type Session = ReturnType<typeof session>

export default function session(path: string) {
  let version = 0

  return {
    path,
    getVersion() {
      return version
    },

    save(data: SessionState, p: string = path) {
      return lib.file(p).write(JSON.stringify({version, data}))
    },

    load: async function (): Promise<SessionState | null | undefined> {
      const migrator = await Migrations.init()
      const file = lib.file(path)

      version = migrator.getLatestVersion()

      if (await file.exists()) {
        return await file
          .read()
          .then(JSON.parse)
          .then((state) => migrate(state, migrator))
          .then((state) => state.data)
          .catch((e) => {
            log.error("Unable to load session state")
            log.error(e)
            return undefined
          })
      } else {
        return undefined
      }
    },

    async delete() {
      const file = lib.file(path)
      if (await file.exists()) {
        return file.remove()
      }
    },
  }
}

type VersionedState = {version: number; data: SessionState | null | undefined}

async function migrate(appState, migrator): Promise<VersionedState> {
  const state = ensureVersioned(appState)

  if (!canMigrate(state)) {
    log.info("Migrations unsupported version, using fresh state")
    return freshState(migrator.getLatestVersion())
  }

  migrator.setCurrentVersion(state.version)
  const pending = migrator.getPending().length

  log.info(`Migrations pending: ${pending}`)

  if (pending) {
    try {
      log.info("Migrations started")
      const nextState = migrator.runPending(state)
      log.info(`Migrated to version: ${nextState.version}`)
      return nextState
    } catch (e) {
      log.error("Unable to Migrate")
      log.error(e)
      return freshState(migrator.getLatestVersion())
    }
  } else {
    return state
  }
}

function ensureVersioned(state) {
  if (isNumber(state.version)) return state
  else
    return {
      version: 0,
      data: state,
    }
}

function canMigrate(state: VersionedState) {
  const legacyVersion = get(state.data, "globalState.version")

  if (!legacyVersion) return true // Already migrated up
  if (legacyVersion === "7") return true // Release right before migration support
  return false // Anything other than above is not migratable
}

function freshState(version): VersionedState {
  return {data: undefined, version}
}
