/* @flow */
import AppError from "../../models/AppError"
import initTestStore from "../../test/initTestStore"
import notice from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

test("init state", () => {
  let state = store.getState()
  expect(notice.getError(state)).toEqual(null)
  expect(notice.getVisible(state)).toBe(false)
})

test("set", () => {
  let e = new AppError()
  let state = store.dispatchAll([notice.set(e)])

  expect(notice.getError(state)).toEqual(e)
  expect(notice.getVisible(state)).toBe(true)
})

test("clear", () => {
  let e = new AppError()
  let state = store.dispatchAll([notice.set(e), notice.clear()])

  expect(notice.getError(state)).toEqual(null)
  expect(notice.getVisible(state)).toBe(true)
})

test("dismiss", () => {
  let e = new AppError()
  let state = store.dispatchAll([notice.set(e), notice.dismiss()])

  expect(notice.getError(state)).toEqual(e)
  expect(notice.getVisible(state)).toBe(false)
})
