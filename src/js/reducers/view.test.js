import reducer, {initialState, getTimeZone} from "./view"
import * as a from "../actions/view"

const reduce = actionList => ({
  view: actionList.reduce(reducer, initialState)
})

test("sets the timezone", () => {
  const actions = [a.setTimeZone("America/Los_Angeles")]
  const state = reduce(actions)
  expect(getTimeZone(state)).toBe("America/Los_Angeles")
})

test("timeZone defaults to UTC", () => {
  const state = reduce([{}])
  expect(getTimeZone(state)).toBe("UTC")
})
