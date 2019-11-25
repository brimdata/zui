/* @flow */
import AppError from "../../models/AppError"
import error from "./"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("init state", () => {
  let state = store.getState()
  expect(error.getError(state)).toEqual(null)
  expect(error.getVisible(state)).toBe(false)
})

test("set", () => {
  let e = new AppError()
  let state = store.dispatchAll([error.set(e)])

  expect(error.getError(state)).toEqual(e)
  expect(error.getVisible(state)).toBe(true)
})

test("clear", () => {
  let e = new AppError()
  let state = store.dispatchAll([error.set(e), error.clear()])

  expect(error.getError(state)).toEqual(null)
  expect(error.getVisible(state)).toBe(true)
})

test("dismiss", () => {
  let e = new AppError()
  let state = store.dispatchAll([error.set(e), error.dismiss()])

  expect(error.getError(state)).toEqual(e)
  expect(error.getVisible(state)).toBe(false)
})
