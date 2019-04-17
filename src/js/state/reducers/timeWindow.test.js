/* @flow */

import {
  clearTimeWindows,
  restoreTimeWindow,
  setInnerTimeWindow,
  setOuterTimeWindow
} from "../actions"
import {getOuterTimeWindow, getInnerTimeWindow} from "./timeWindow"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("setting the outer time window", () => {
  const range = [new Date(), new Date()]
  const state = store.dispatchAll([setOuterTimeWindow(range)])

  expect(getOuterTimeWindow(state)).toEqual(range)
})

test("setting the inner time window", () => {
  const range = [new Date(), new Date()]
  const state = store.dispatchAll([setInnerTimeWindow(range)])

  expect(getInnerTimeWindow(state)).toEqual(range)
})

test("restoring the time window", () => {
  store.dispatch(
    restoreTimeWindow({
      inner: [new Date("1"), new Date("2")],
      outer: [new Date("0"), new Date("3")]
    })
  )

  const state = store.getState()
  expect(getInnerTimeWindow(state)).toEqual([new Date("1"), new Date("2")])
  expect(getOuterTimeWindow(state)).toEqual([new Date("0"), new Date("3")])
})

test("clearing the time window", () => {
  const state = store.dispatchAll([
    restoreTimeWindow({
      inner: [new Date("1"), new Date("2")],
      outer: [new Date("0"), new Date("3")]
    }),
    clearTimeWindows()
  ])

  expect(getInnerTimeWindow(state)).toBe(null)
  expect(getOuterTimeWindow(state)).not.toEqual([new Date("0"), new Date("3")])
})
