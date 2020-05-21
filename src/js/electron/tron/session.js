/* @flow */

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
      let saved = await lib
        .file(path)
        .read()
        .then(JSON.parse)
        .then(migrate)
        .catch(handleError)

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

type VersionedState = {version: number, data: SessionState}

async function migrate(appState): Promise<VersionedState> {
  let state = ensureVersioned(appState)
  let migrations = await tron.migrations(state.version)
  let pending = migrations.getPending().length

  log.info(`migrations: currentVersion=${state.version} pending=${pending}`)

  if (pending) {
    log.info("migrations: running")
    let nextState = migrations.runPending(state)
    log.info(`migrations: currentVersion=${nextState.version}`)
    return nextState
  } else {
    return state
  }
}

function handleError(e) {
  log.error("Unable to load session state")
  log.error(e)
  return undefined
}

function ensureVersioned(state) {
  if (isNumber(state.version)) return state
  else
    return {
      version: 0,
      data: state
    }
}
