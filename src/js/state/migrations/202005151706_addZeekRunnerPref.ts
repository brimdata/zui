import {getAllStates} from "../../test/helpers/getTestState"

export default function addZeekRunnerPref(state: any) {
  for (const s of getAllStates(state)) {
    s.prefs.zeekRunner = ""
  }
  return state
}
