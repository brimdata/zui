/* @flow */

import {clearErrors, createError, getErrors} from "./"
import AppError from "../../models/AppError"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("ERROR_CREATE", () => {
  let state = store.dispatchAll([createError("Bug")])

  expect(getErrors(state)[0]).toEqual(expect.any(AppError))
})

test("ERRORS_CLEAR", () => {
  let state = store.dispatchAll([
    createError("Bug"),
    createError("Bug2"),
    clearErrors()
  ])

  expect(getErrors(state)).toEqual([])
})
