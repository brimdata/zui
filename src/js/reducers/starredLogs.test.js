import reducer, {initialState} from "./starredLogs"
import {starLog, unstarLog} from "../actions/starredLogs"

const tuple = ["1", "2", "3", "4"]

test("starring a log", () => {
  const actions = [starLog(tuple)]
  const state = actions.reduce(reducer, initialState)

  expect(state).toEqual([tuple])
})

test("unstarring a log", () => {
  const actions = [starLog(tuple), unstarLog(tuple)]
  const state = actions.reduce(reducer, initialState)

  expect(state).toEqual([])
})
