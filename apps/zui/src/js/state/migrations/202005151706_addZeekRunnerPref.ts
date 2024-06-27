import {getAllStates} from "src/js/state/migrations/utils/getTestState"

export default function addZeekRunnerPref(state: any) {
  for (const s of getAllStates(state)) {
    s.prefs.zeekRunner = ""
  }
  return state
}
