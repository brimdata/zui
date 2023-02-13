import {migrate} from "src/test/unit/helpers/migrate"
import {getAllStates} from "src/js/state/migrations/utils/getTestState"

test("migrating 202302131226_renameDelimeterToDelimiter", async () => {
  const next = await migrate({
    state: "v0.30.0-364-g1adeeafd",
    to: "202302131226",
  })
  expect.assertions(4)
  for (const s of getAllStates(next)) {
    if (!s.configPropValues) continue
    expect(s.configPropValues.pools.nameDelimeter).toBeUndefined()
    expect(s.configPropValues.pools.nameDelimiter).toBeDefined()
  }
})
