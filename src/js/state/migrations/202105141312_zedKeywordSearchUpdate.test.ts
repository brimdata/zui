import {getAllStates} from "src/js/state/migrations/utils/getTestState"
import {migrate} from "test/unit/helpers/migrate"
import {parse} from "zealot-old"
import {UPDATED_V25_DEFAULT_QUERIES} from "./202105141312_zedKeywordSearchUpdate"

test("migrating 202105141312_zedKeywordSearchUpdate", async () => {
  const next = await migrate({state: "v0.24.0", to: "202105141312"})
  expect.assertions(24)

  for (const state of getAllStates(next)) {
    state.queries.items.forEach((i) => {
      const newQuery = UPDATED_V25_DEFAULT_QUERIES.find((q) => q.id === i.id)
      if (newQuery) {
        expect(i.value).toBe(newQuery.value)
        parse(i.value) // this will throw if it doesn't work
      }
    })
  }
})
