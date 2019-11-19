/* @flow */

import brim from "../../brim"
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
  const state = store.dispatchAll([
    search.setSpanFocus(brim.time.convertToSpan(range))
  ])

  expect(search.getSpanFocusAsDates(state)).toEqual(range)
})
