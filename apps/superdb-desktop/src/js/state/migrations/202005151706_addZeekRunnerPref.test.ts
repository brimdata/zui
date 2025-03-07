import getTestState, {
  getAllStates,
} from "src/js/state/migrations/utils/getTestState"
import migrate from "./202005151706_addZeekRunnerPref"

test("migrating 202005151706_addZeekRunnerPref", () => {
  const prev = getTestState("v0.9.1")

  const next = migrate(prev)

  for (const state of getAllStates(next)) {
    expect(state.prefs.zeekRunner).toEqual("")
  }
})
