/* @flow */
import path from "path"

import type {SessionState} from "../../electron/tron/formatSessionState"
import lib from "../../lib"

export default (version: string) => {
  let name = `${version}.json`
  let file = path.join(__dirname, "../states", name)
  let contents
  try {
    contents = lib.file(file).readSync()
  } catch (e) {
    throw new Error(`Missing Test state for Version ${version}
No File: ${file}
To create test state, run the app and navigate to...
App Menu => Developer => Save Session for Testing Migrations`)
  }
  return JSON.parse(contents)
}

export function getAllStates(sessionState: SessionState): Object[] {
  let allStates = [sessionState.globalState]
  for (let key in sessionState.windows) {
    allStates.push(sessionState.windows[key].state)
  }
  return allStates
}
