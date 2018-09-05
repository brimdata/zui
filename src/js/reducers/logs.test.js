import * as a from "../actions/logs"
import reducer, {
  initialState,
  getLogsIsFetching,
  getLogTuples,
  getLogsError
} from "./logs"

const reduce = actions => ({
  logs: actions.reduce(reducer, initialState)
})

test("request logs", () => {
  const state = reduce([a.requestLogs()])

  expect(getLogsIsFetching(state)).toBe(true)
})

test("request logs clears out existing tuples", () => {
  const tuples = [["1", "conn"]]
  const state = reduce([a.receiveLogs(tuples), a.requestLogs()])

  expect(getLogTuples(state)).toEqual([])
})

test("receive logs", () => {
  const tuples = [["1", "conn"]]
  const state = reduce([a.receiveLogs(tuples)])

  expect(getLogTuples(state)).toEqual(tuples)
})

test("receive logs twice concats them", () => {
  const tuples = [["1", "conn"]]
  const moreTuples = [["2", "conn"]]
  const state = reduce([a.receiveLogs(tuples), a.receiveLogs(moreTuples)])

  expect(getLogTuples(state)).toEqual([...tuples, ...moreTuples])
})

test("success logs sets is fetching to false", () => {
  const state = reduce([a.requestLogs(), a.successLogs()])

  expect(getLogsIsFetching(state)).toBe(false)
})

test("error logs sets an error", () => {
  const state = reduce([a.requestLogs(), a.errorLogs("something bad")])

  expect(getLogsError(state)).toBe("something bad")
})

test("error sets isFetching to false", () => {
  const state = reduce([a.requestLogs(), a.errorLogs("something bad")])

  expect(getLogsIsFetching(state)).toBe(false)
})
