/* @flow */

import * as logViewer from "./logViewer"
import * as a from "../actions/logViewer"
import initStore from "../test/initStore"
import dispatchAll from "../test/dispatchAll"

let store
beforeEach(() => {
  store = initStore()
})

test("initialState", () => {
  const initialState = store.getState()
  expect(logViewer.moreAhead(initialState)).toBe(false)
  expect(logViewer.moreBehind(initialState)).toBe(false)
  expect(logViewer.isFetchingAhead(initialState)).toBe(false)
  expect(logViewer.isFetchingBehind(initialState)).toBe(false)
})

test("#setMoreBehind", () => {
  const state = dispatchAll(store, [a.setMoreBehind(true)])
  expect(logViewer.moreBehind(state)).toBe(true)
})

test("#setMoreAhead", () => {
  const state = dispatchAll(store, [a.setMoreAhead(true)])
  expect(logViewer.moreAhead(state)).toBe(true)
})

test("#setIsFetchingBehind", () => {
  const state = dispatchAll(store, [a.setIsFetchingBehind(true)])
  expect(logViewer.isFetchingBehind(state)).toBe(true)
})

test("#setIsFetchingAhead", () => {
  const state = dispatchAll(store, [a.setIsFetchingAhead(true)])
  expect(logViewer.isFetchingAhead(state)).toBe(true)
})
