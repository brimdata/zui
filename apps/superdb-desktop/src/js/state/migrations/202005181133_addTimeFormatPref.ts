import {getAllStates} from "src/js/state/migrations/utils/getTestState"

export default function addTimeFormatPref(state: any) {
  for (const s of getAllStates(state)) {
    s.prefs.timeFormat = ""
  }
  return state
}
