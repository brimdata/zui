import {getAllStates} from "./utils/getTestState"

function findFirst(states, fn) {
  let value
  for (const s of states) {
    value = fn(s)
    if (value) break
  }
  return value
}

export default function movePreferences(state: any) {
  // Migrate state here
  const states = getAllStates(state)
  let timeFormat = findFirst(states, (s) => s?.prefs?.timeFormat)
  let dataDir = findFirst(states, (s) => s?.prefs?.dataDir)
  let timeZone = findFirst(states, (s) => s?.view?.timeZone)

  for (const s of getAllStates(state)) {
    s.configPropValues = {display: {}, core: {}, ...s.configPropValues}
    s.configPropValues.display.timeFormat = timeFormat
    s.configPropValues.display.timeZone = timeZone
    s.configPropValues.core.dataDir = dataDir
    delete s.prefs
    delete s?.view?.timeZone
  }
  return state
}
