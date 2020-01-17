/* @flow */
import Boomd from "./"
import initTestStore from "../../test/initTestStore"

test("setting use analytics cache", () => {
  const store = initTestStore()
  store.dispatch(Boomd.useCache(true))
  expect(Boomd.usingCache(store.getState())).toEqual(true)
  store.dispatch(Boomd.useCache(false))
  expect(Boomd.usingCache(store.getState())).toEqual(false)
})

test("setting use index", () => {
  const store = initTestStore()
  store.dispatch(Boomd.useIndex(true))
  expect(Boomd.usingIndex(store.getState())).toEqual(true)
  store.dispatch(Boomd.useIndex(false))
  expect(Boomd.usingIndex(store.getState())).toEqual(false)
})
