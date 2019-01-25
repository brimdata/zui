import initStore from "../test/initStore"
import * as actions from "../actions/whois"
import {getWhoisText, getWhoisIsOpen, getWhoisAddr} from "./whois"

let store
beforeEach(() => {
  store = initStore()
})

test("whois lookup success", done => {
  const fakeClientFunc = () => new Promise(resolve => resolve("i am"))
  const action = actions.fetchWhois("www.example.com", fakeClientFunc)

  store.dispatch(action).then(() => {
    expect(getWhoisText(store.getState())).toEqual("i am")
    expect(getWhoisAddr(store.getState())).toEqual("www.example.com")
    expect(getWhoisIsOpen(store.getState())).toEqual(true)
    done()
  })
})

test("whois lookup error", done => {
  const fakeClientFunc = () => new Promise((_, reject) => reject("error here"))
  const action = actions.fetchWhois("www.example.com", fakeClientFunc)

  store.dispatch(action).then(() => {
    expect(getWhoisText(store.getState())).toEqual("error here")
    expect(getWhoisIsOpen(store.getState())).toEqual(true)
    done()
  })
})

test("open whois", () => {
  const state = store.dispatchAll([actions.openWhois()])

  expect(getWhoisIsOpen(state)).toBe(true)
})

test("close whois", () => {
  const state = store.dispatchAll([actions.openWhois(), actions.closeWhois()])

  expect(getWhoisIsOpen(state)).toBe(false)
})
