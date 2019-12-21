/* @flow */

import {
  hideDownloads,
  setLeftSidebarWidth,
  setRightSidebarWidth,
  setTimeZone,
  showDownloads
} from "../actions"
import initTestStore from "../../test/initTestStore"
import * as view from "./view"

let store, reduce
beforeEach(() => {
  store = initTestStore()
  reduce = store.dispatchAll
})

test("sets the timezone", () => {
  const actions = [setTimeZone("America/Los_Angeles")]
  const state = reduce(actions)
  expect(view.getTimeZone(state)).toBe("America/Los_Angeles")
})

test("timeZone defaults to UTC", () => {
  const state = store.getState()
  expect(view.getTimeZone(state)).toBe("UTC")
})

test("setting right side bar width", () => {
  const state = reduce([setRightSidebarWidth(299)])

  expect(view.getRightSidebarWidth(state)).toBe(299)
})

test("setting left side bar width", () => {
  const state = reduce([setLeftSidebarWidth(1299)])

  expect(view.getLeftSidebarWidth(state)).toBe(1299)
})

test("showing the downloads bar", () => {
  const state = reduce([showDownloads()])

  expect(view.getDownloadsIsOpen(state)).toBe(true)
})

test("hiding the downloads bar", () => {
  const state = reduce([showDownloads(), hideDownloads()])

  expect(view.getDownloadsIsOpen(state)).toBe(false)
})
