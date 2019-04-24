/* @flow */

import {clearErrors, createError, getErrors} from "./"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("ERROR_CREATE", () => {
  let state = store.dispatchAll([createError("Bug")])

  expect(getErrors(state)).toEqual(["Bug"])
})

test("ERRORS_CLEAR", () => {
  let state = store.dispatchAll([
    createError("Bug"),
    createError("Bug2"),
    clearErrors()
  ])

  expect(getErrors(state)).toEqual([])
})
