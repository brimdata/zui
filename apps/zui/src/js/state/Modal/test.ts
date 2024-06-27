/**
 * @jest-environment jsdom
 */

import initTestStore from "src/test/unit/helpers/initTestStore"
import Modal from "./"

let store
beforeEach(async () => {
  store = await initTestStore()
})

test("show modal", () => {
  store.dispatch(Modal.show("whois", {addr: "129.3.2.1"}))

  const state = store.getState()

  expect(Modal.getName(state)).toEqual("whois")
  expect(Modal.getArgs(state)).toEqual({addr: "129.3.2.1"})
})

test("hide Modal", () => {
  store.dispatch(Modal.show("whois", {addr: "129.3.2.1"}))
  store.dispatch(Modal.hide())

  const state = store.getState()

  expect(Modal.getName(state)).toBe("")
  expect(Modal.getArgs(state)).toEqual({})
})
