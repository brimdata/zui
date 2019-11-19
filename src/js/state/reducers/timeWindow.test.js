/* @flow */

import {
  clearTimeWindows,
  setInnerTimeWindow,
  setNextOuterTimeWindow
} from "../span/actions"
import {getInnerTimeWindow, getNextOuterTimeWindow} from "./timeWindow"
import initTestStore from "../../test/initTestStore"
import search from "../search"

let store
beforeEach(() => {
  store = initTestStore()
})

test("setting the outer time window", () => {
  const range = [new Date(), new Date()]
  const state = store.dispatchAll([
    search.setSpanArgsFromDates(range),
    search.computeSpan()
  ])

  expect(search.getSpanAsDates(state)).toEqual(range)
})

test("setting the inner time window", () => {
  const range = [new Date(), new Date()]
  const state = store.dispatchAll([setInnerTimeWindow(range)])

  expect(getInnerTimeWindow(state)).toEqual(range)
})

test("clearing the time window", () => {
  const state = store.dispatchAll([clearTimeWindows()])

  expect(getInnerTimeWindow(state)).toBe(null)
  expect(search.getSpanAsDates(state)).not.toEqual([
    new Date("0"),
    new Date("3")
  ])
})

test("next outer time window set", () => {
  let state = store.dispatchAll([
    setNextOuterTimeWindow([new Date(0), new Date(1)])
  ])

  expect(getNextOuterTimeWindow(state)).toEqual([new Date(0), new Date(1)])
})
