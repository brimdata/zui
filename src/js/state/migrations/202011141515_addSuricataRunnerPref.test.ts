import Prefs from "../Prefs"
import getTestState, {getAllStates} from "../../test/helpers/getTestState"
import migrate from "./202011141515_addSuricataRunnerPref"

test("migrating 202011141515_addSuricataRunnerPref", () => {
  const prev = getTestState("v0.17.0")

  const next = migrate(prev)

  for (const state of getAllStates(next)) {
    expect(Prefs.getSuricataRunner(state)).toEqual("")
  }
})
