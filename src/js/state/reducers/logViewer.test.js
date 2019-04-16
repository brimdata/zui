/* @flow */

import {
  clearLogViewer,
  setIsFetchingAhead,
  setIsFetchingBehind,
  setMoreAhead,
  setMoreBehind
} from "../actions"
import dispatchAll from "../../test/dispatchAll"
import initTestStore from "../../test/initTestStore"
import * as logViewer from "./logViewer"

let store
beforeEach(() => {
  store = initTestStore()
})

test("initialState", () => {
  const initialState = store.getState()
  expect(logViewer.moreAhead(initialState)).toBe(false)
  expect(logViewer.moreBehind(initialState)).toBe(false)
  expect(logViewer.isFetchingAhead(initialState)).toBe(false)
  expect(logViewer.isFetchingBehind(initialState)).toBe(false)
})

test("#setMoreBehind", () => {
  const state = dispatchAll(store, [setMoreBehind(true)])
  expect(logViewer.moreBehind(state)).toBe(true)
})

test("#setMoreAhead", () => {
  const state = dispatchAll(store, [setMoreAhead(true)])
  expect(logViewer.moreAhead(state)).toBe(true)
})

test("#setIsFetchingBehind", () => {
  const state = dispatchAll(store, [setIsFetchingBehind(true)])
  expect(logViewer.isFetchingBehind(state)).toBe(true)
})

test("#setIsFetchingAhead", () => {
  const state = dispatchAll(store, [setIsFetchingAhead(true)])
  expect(logViewer.isFetchingAhead(state)).toBe(true)
})

test("clearing the log viewer", () => {
  store.dispatchAll([setMoreAhead(true), clearLogViewer()])

  expect(logViewer.moreAhead(store.getState())).toBe(false)
})
