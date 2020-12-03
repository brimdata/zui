import {getAllStates} from "../../test/helpers/getTestState"

export default function addSuricataRunnerPref(state: any) {
  for (const s of getAllStates(state)) {
    s.prefs.suricataRunner = ""
  }
  return state
}
