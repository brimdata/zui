/* @flow */

import {
  appendResults,
  clearResults,
  resultsComplete,
  resultsLimit,
  spliceResults
} from "./actions"
import {conn, dns, http} from "../../test/mockLogs"
import {
  getResultLogs,
  getResultsAreComplete,
  getResultsAreIncomplete,
  getResultsAreLimitted
} from "./selector"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("append results", () => {
  let state = store.dispatchAll([
    appendResults([conn(), dns()]),
    appendResults([http()])
  ])

  expect(getResultLogs(state)).toEqual([conn(), dns(), http()])
})

test("clear results", () => {
  let state = store.dispatchAll([
    appendResults([conn(), dns()]),
    appendResults([http()]),
    clearResults()
  ])

  expect(getResultLogs(state)).toEqual([])
})

test("splice results", () => {
  let state = store.dispatchAll([
    appendResults([conn(), dns()]),
    appendResults([http()]),
    spliceResults(1)
  ])

  expect(getResultLogs(state)).toEqual([conn()])
})

test("results complete", () => {
  let state = store.dispatchAll([resultsComplete()])

  expect(getResultsAreComplete(state)).toBe(true)
})

test("results incomplete", () => {
  let state = store.getState()

  expect(getResultsAreIncomplete(state)).toBe(true)
})

test("results limitted", () => {
  let state = store.dispatchAll([resultsLimit()])

  expect(getResultsAreLimitted(state)).toBe(true)
})
