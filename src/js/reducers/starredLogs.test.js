/* @flow */

import {starLog, unstarLog, clearStarredLogs} from "../actions/starredLogs"
import {getStarredLogs} from "./starredLogs"
import initTestStore from "../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

const tuple = ["1", "2", "3", "4"]

test("starring a log", () => {
  const state = store.dispatchAll([starLog(tuple)])

  expect(getStarredLogs(state)).toEqual([tuple])
})

test("unstarring a log", () => {
  const state = store.dispatchAll([starLog(tuple), unstarLog(tuple)])

  expect(getStarredLogs(state)).toEqual([])
})

test("clearing the starred logs", () => {
  const state = store.dispatchAll([starLog(tuple), clearStarredLogs()])

  expect(getStarredLogs(state)).toEqual([])
})
