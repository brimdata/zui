import {migrate} from "test/unit/helpers/migrate"
import {getAllStates} from "src/js/state/migrations/utils/getTestState"

test("migrating 202011141515_addSuricataUpdaterPref", async () => {
  const next = await migrate({state: "v0.17.0", to: "202011141515"})
  for (const state of getAllStates(next)) {
    expect(state.prefs.suricataRunner).toEqual("")
  }
})
