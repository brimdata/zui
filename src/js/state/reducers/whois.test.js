/* @flow */

import {closeWhois, openWhois} from "../actions"
import {fetchWhois} from "../thunks/whois"
import {getWhoisText, getWhoisIsOpen, getWhoisAddr} from "./whois"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("whois lookup success", (done) => {
  const fakeClientFunc = () => new Promise((resolve) => resolve("i am"))
  const action = fetchWhois("www.example.com", fakeClientFunc)

  store.dispatch(action).then(() => {
    expect(getWhoisText(store.getState())).toEqual("i am")
    expect(getWhoisAddr(store.getState())).toEqual("www.example.com")
    expect(getWhoisIsOpen(store.getState())).toEqual(true)
    done()
  })
})

test("whois lookup error", (done) => {
  const fakeClientFunc = () => new Promise((_, reject) => reject("error here"))
  const action = fetchWhois("www.example.com", fakeClientFunc)

  store.dispatch(action).then(() => {
    expect(getWhoisText(store.getState())).toEqual("error here")
    expect(getWhoisIsOpen(store.getState())).toEqual(true)
    done()
  })
})

test("open whois", () => {
  const state = store.dispatchAll([openWhois()])

  expect(getWhoisIsOpen(state)).toBe(true)
})

test("close whois", () => {
  const state = store.dispatchAll([openWhois(), closeWhois()])

  expect(getWhoisIsOpen(state)).toBe(false)
})
