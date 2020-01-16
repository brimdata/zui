/* @flow */

import initTestStore from "../../test/initTestStore"
import modal from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

test("show modal", () => {
  store.dispatch(modal.show("whois", {addr: "129.3.2.1"}))

  let state = store.getState()

  expect(modal.getName(state)).toEqual("whois")
  expect(modal.getArgs(state)).toEqual({addr: "129.3.2.1"})
})

test("hide modal", () => {
  let state = store.dispatchAll([
    modal.show("whois", {addr: "129.3.2.1"}),
    modal.hide()
  ])

  expect(modal.getName(state)).toBe("")
  expect(modal.getArgs(state)).toEqual({})
})
