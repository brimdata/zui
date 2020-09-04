

import { getAllStates } from "../../test/helpers/getTestState";

export default function addZeekRunnerPref(state: any) {
  for (let s of getAllStates(state)) {
    s.prefs.zeekRunner = "";
  }
  return state;
}