/* @flow */

import {
  clearAllCorrelations,
  clearCorrelations,
  setCorrelation
} from "../actions/correlations"
import {getCorrelations} from "./correlations"
import initStore from "../test/initStore"

const store = initStore()
const hash = {name: "hash", data: {descriptor: [], tuples: []}}
const uid = {name: "uid", data: {descriptors: {}, tuples: []}}
const get = key => getCorrelations(store.getState())[key]

test("setting a correlation", () => {
  store.dispatch(setCorrelation("123-456", hash))

  expect(get("123-456")).toEqual({
    hash: hash.data
  })
})

test("setting multiple", () => {
  store.dispatchAll([setCorrelation("123", hash), setCorrelation("123", uid)])

  expect(get("123")).toEqual({
    hash: expect.any(Object),
    uid: expect.any(Object)
  })
})

test("clearing one correlation", () => {
  store.dispatchAll([
    setCorrelation("123", hash),
    setCorrelation("345", uid),
    clearCorrelations("123")
  ])

  expect(get("123")).toBeUndefined()
})

test("clearing all correlations", () => {
  const state = store.dispatchAll([
    setCorrelation("123", hash),
    setCorrelation("123", uid),
    clearAllCorrelations()
  ])

  expect(getCorrelations(state)).toEqual({})
})
