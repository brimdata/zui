import reducer, {
  initialState,
  getOuterTimeWindow,
  getInnerTimeWindow
} from "./timeWindow"
import * as actions from "../actions/timeWindow"
import initStore from "../test/initStore"

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

test("restoring the time window", () => {
  const store = initStore()

  store.dispatch(
    actions.restoreTimeWindow({
      inner: [new Date("1"), new Date("2")],
      outer: [new Date("0"), new Date("3")]
    })
  )

  const state = store.getState()
  expect(getInnerTimeWindow(state)).toEqual([new Date("1"), new Date("2")])
  expect(getOuterTimeWindow(state)).toEqual([new Date("0"), new Date("3")])
})
