import compact from "lodash/compact"
import states from "src/test/unit/states"
import {SessionState} from "src/electron/session-state"
import file from "src/js/lib/file"

export default (version: string) => {
  const name = `${version}.json`
  const filePath = states.getPath(name)
  let contents
  try {
    contents = file(filePath).readSync()
  } catch (e) {
    throw new Error(`Missing Test state for Version ${version}
No File: ${filePath}
To create test state, run the app and navigate to...
App Menu => Developer => Save Session for Testing Migrations`)
  }
  return JSON.parse(contents)
}

export function getAllStates(sessionState: SessionState): any[] {
  if (!sessionState) return []

  const allStates = [sessionState.globalState]
  for (const key in sessionState.windows) {
    // @ts-ignore
    allStates.push(sessionState.windows[key].state)
  }

  return compact(allStates)
}

export function getAllRendererStates(sessionState: SessionState): any[] {
  const states = []
  for (const key in sessionState.windows) {
    states.push(sessionState.windows[key].state)
  }
  return compact(states)
}

export function getAllTabs_before_202307101053(
  sessionState: SessionState
): any[] {
  let tabs = []
  for (const state of getAllStates(sessionState)) {
    if (state.tabs) {
      tabs = tabs.concat(state.tabs.data)
    }
  }
  return tabs
}

export function getAllTabs(sessionState: SessionState): any[] {
  let tabs = []
  for (const renderer of getAllRendererStates(sessionState)) {
    for (const lakeId in renderer.window.tabs) {
      const tabGroup = renderer.window.tabs[lakeId]
      tabs = tabs.concat(tabGroup.data)
    }
  }
  return tabs
}
