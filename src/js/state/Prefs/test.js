/* @flow */

import Prefs from "./"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("the default json type config", () => {
  let state = store.getState()

  expect(Prefs.getJSONTypeConfig(state)).toBe("")
})

test("set the json types config", () => {
  let state = store.dispatchAll([Prefs.setJSONTypeConfig("/my/types.json")])

  expect(Prefs.getJSONTypeConfig(state)).toBe("/my/types.json")
})

test("set the preferred time format", () => {
  let state = store.dispatchAll([Prefs.setTimeFormat("YYYY")])

  expect(Prefs.getTimeFormat(state)).toEqual("YYYY")
})
