/**
 * @jest-environment jsdom
 */

import dispatchAll from "src/test/unit/helpers/dispatchAll"
import {Store} from "../types"
import Errors from "./"
import initTestStore from "src/test/unit/helpers/initTestStore"

let store: Store
beforeEach(async () => {
  store = await initTestStore()
})

test("ERROR_CREATE", () => {
  const state = dispatchAll(store, [Errors.createError("Bug")])

  expect(Errors.getErrors(state)[0]).toEqual({
    type: "AppError",
    message: "Bug",
    details: [],
  })
})

test("ERRORS_CLEAR", () => {
  const state = dispatchAll(store, [
    Errors.createError("Bug"),
    Errors.createError("Bug2"),
    Errors.clearErrors(),
  ])

  expect(Errors.getErrors(state)).toEqual([])
})
