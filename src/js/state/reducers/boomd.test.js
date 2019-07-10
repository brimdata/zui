/* @flow */
import {getUseBoomCache, getUseBoomIndex} from "./boomd"
import {useBoomCache, useBoomIndex} from "../actions"
import initTestStore from "../../test/initTestStore"

test("setting use analytics cache", () => {
  const store = initTestStore()

  store.dispatch(useBoomCache(true))

  expect(getUseBoomCache(store.getState())).toEqual(true)

  store.dispatch(useBoomCache(false))

  expect(getUseBoomCache(store.getState())).toEqual(false)
})

test("setting use index", () => {
  const store = initTestStore()

  store.dispatch(useBoomIndex(true))

  expect(getUseBoomIndex(store.getState())).toEqual(true)

  store.dispatch(useBoomIndex(false))

  expect(getUseBoomIndex(store.getState())).toEqual(false)
})
