/* @flow */

import {clearTimeWindows, setInnerTimeWindow} from "../span/actions"
import {getInnerTimeWindow} from "./timeWindow"
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
