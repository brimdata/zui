/* @flow */

import {get} from "lodash"
import log from "electron-log"

import {app} from "electron"
import path from "path"

import type {SessionState} from "./formatSessionState"
import {isNumber} from "../../lib/is"
import lib from "../../lib"
import tron from "./"

export default function session(path: string = sessionStateFile()) {
  let version = 0

  return {
    getVersion() {
      return version
    },

    save(data: SessionState, p: string = path) {
      return lib.file(p).write(JSON.stringify({version, data}))
    },

    load: async function(): Promise<?SessionState> {
      const migrator = await tron.migrations()
      const saved = await lib
        .file(path)
        .read()
        .then(JSON.parse)
        .then((state) => migrate(state, migrator))
        .catch((e) => {
          log.error("Unable to load session state")
          log.error(e)
          return freshState(migrator.getLatestVersion())
        })

      if (saved) {
        version = saved.version
        return saved.data
      } else {
        return undefined
      }
    }
  }
}

function sessionStateFile() {
  // This can't be a const because we adjust the
  // userData path first thing inside main().
  return path.join(app.getPath("userData"), "appState.json")
}

type VersionedState = {version: number, data: ?SessionState}

async function migrate(appState, migrator): Promise<VersionedState> {
  let state = ensureVersioned(appState)

  if (!canMigrate(state)) {
    log.info("migrations: unsupported version, using fresh state")
    return freshState(migrator.getLatestVersion())
  }

  migrator.setCurrentVersion(state.version)
  let pending = migrator.getPending().length

  log.info(`migrations: currentVersion=${state.version} pending=${pending}`)

  if (pending) {
    try {
      log.info("migrations: running")
      let nextState = migrator.runPending(state)
      log.info(`migrations: currentVersion=${nextState.version}`)
      return nextState
    } catch (e) {
      log.error("Unable to migrate data")
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
      data: state
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
