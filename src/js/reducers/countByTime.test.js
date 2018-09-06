import reducer, {
  initialState,
  getCountByTimeData,
  getCountByTimeIsFetching,
  getCountByTimeError
} from "./countByTime"
import * as a from "../actions/countByTime"

const reduce = actions => ({
  countByTime: actions.reduce(reducer, initialState)
})

test("requestCountByTime sets isFetching to true", () => {
  const state = reduce([a.requestCountByTime()])

  expect(getCountByTimeIsFetching(state)).toBe(true)
})

test("receive data", () => {
  const data = {
    tuples: [["1"], ["2"]],
    descriptor: [{type: "integer", name: "count"}]
  }
  const state = reduce([a.requestCountByTime(), a.receiveCountByTime(data)])

  expect(getCountByTimeData(state)).toEqual(data)
})

test("receive data twice", () => {
  const data = {
    tuples: [["1"], ["2"]],
    descriptor: [{type: "integer", name: "count"}]
  }
  const state = reduce([
    a.requestCountByTime(),
    a.receiveCountByTime(data),
    a.receiveCountByTime(data)
  ])

  expect(getCountByTimeData(state)).toEqual({
    tuples: [["1"], ["2"], ["1"], ["2"]],
    descriptor: [{type: "integer", name: "count"}]
  })
})

test("sets error message", () => {
  const state = reduce([a.errorCountByTime("bad bad")])

  expect(getCountByTimeError(state)).toEqual("bad bad")
})

test("error sets is fetching to false", () => {
  const state = reduce([a.requestCountByTime(), a.errorCountByTime("bad bad")])

  expect(getCountByTimeIsFetching(state)).toBe(false)
})

test("success sets is fetching to false", () => {
  const state = reduce([a.requestCountByTime(), a.successCountByTime()])

  expect(getCountByTimeIsFetching(state)).toBe(false)
})
