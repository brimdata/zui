import Prefs from "../Prefs"
import getTestState, {getAllStates} from "../../test/helpers/getTestState"
import migrate from "./202005151706_addZeekRunnerPref"

test("migrating 202005151706_addZeekRunnerPref", () => {
  let prev = getTestState("v0.9.1")

  let next = migrate(prev)

  for (let state of getAllStates(next)) {
    expect(Prefs.getZeekRunner(state)).toEqual("")
  }
})
