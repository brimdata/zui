import getTestState, {getAllStates} from "../../test/helpers/getTestState"
import migrate from "./202101051511_initQueryLibrary"

test("migrating 202101051511_initQueryLibrary", () => {
  let {data} = getTestState("v0.21.1")

  let next = migrate(data)

  for (const state of getAllStates(next)) {
    expect(state.queries).toBe(undefined)
  }
})
