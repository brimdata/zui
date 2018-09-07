import reducer, {
  initialState,
  getOuterTimeWindow,
  getInnerTimeWindow
} from "./timeWindow"
import * as actions from "../actions/timeWindow"

const reduce = actions => ({
  timeWindow: actions.reduce(reducer, initialState)
})

test("setting the outer time window", () => {
  const range = [new Date(), new Date()]
  const state = reduce([actions.setOuterTimeWindow(range)])

  expect(getOuterTimeWindow(state)).toEqual(range)
})

test("setting the inner time window", () => {
  const range = [new Date(), new Date()]
  const state = reduce([actions.setInnerTimeWindow(range)])

  expect(getInnerTimeWindow(state)).toEqual(range)
})
