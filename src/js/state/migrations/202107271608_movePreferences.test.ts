import {migrate} from "test/unit/helpers/migrate"
import {getAllStates} from "./utils/getTestState"

test("migrating 202107271608_movePreferences", async () => {
  expect.assertions(6)
  const next = await migrate({state: "v0.24.0", to: "202107271608"})
  for (let s of getAllStates(next)) {
    expect(s.configPropValues.display.timeFormat).toBe("YYYY-MM")
    expect(s.configPropValues.display.timeZone).toBe("US/Pacific")
    expect(s.configPropValues.core.dataDir).toBe("/my/fav/place")
  }
})
