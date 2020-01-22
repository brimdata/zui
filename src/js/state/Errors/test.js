/* @flow */

import AppError from "../../models/AppError"
import Errors from "./"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("ERROR_CREATE", () => {
  let state = store.dispatchAll([Errors.createError("Bug")])

  expect(Errors.getErrors(state)[0]).toEqual(expect.any(AppError))
})

test("ERRORS_CLEAR", () => {
  let state = store.dispatchAll([
    Errors.createError("Bug"),
    Errors.createError("Bug2"),
    Errors.clearErrors()
  ])

  expect(Errors.getErrors(state)).toEqual([])
})
