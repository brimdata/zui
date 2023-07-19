import {getAllStates} from "src/js/state/migrations/utils/getTestState"

export default function addSuricataRunnerPref(state: any) {
  for (const s of getAllStates(state)) {
    s.prefs.suricataRunner = ""
  }
  return state
}
