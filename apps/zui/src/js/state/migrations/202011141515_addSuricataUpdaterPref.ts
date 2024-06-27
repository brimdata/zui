import {getAllStates} from "src/js/state/migrations/utils/getTestState"

export default function addSuricataUpdaterPref(state: any) {
  for (const s of getAllStates(state)) {
    s.prefs.suricataUpdater = ""
  }
  return state
}
