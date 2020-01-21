/* @flow */

import History from "./"
import SearchBar from "../SearchBar"
import Tab from "../Tab"
import initTestStore from "../../test/initTestStore"
import submitSearch from "../../flows/submitSearch"

let store
beforeEach(() => {
  store = initTestStore()
  store.dispatchAll([
    SearchBar.changeSearchBarInput("first"),
    submitSearch(),
    SearchBar.changeSearchBarInput("second"),
    submitSearch(),
    SearchBar.changeSearchBarInput("third"),
    submitSearch()
  ])
})

test("pushing history", () => {
  const state = store.getState()
  const entry = Tab.currentEntry(state)
  expect(entry.program).toEqual("third")
})

test("moving back changes the position", () => {
  let state = store.dispatchAll([History.back()])
  const entry = Tab.currentEntry(state)
  expect(entry.program).toEqual("second")
})

test("going forward in history", () => {
  let state = store.dispatchAll([
    History.back(),
    History.back(),
    History.forward()
  ])
  const entry = Tab.currentEntry(state)
  expect(entry.program).toEqual("second")
})

test("going back in history then pushing new history", () => {
  let state = store.dispatchAll([
    History.back(),
    History.back(),
    SearchBar.changeSearchBarInput("fourth"),
    submitSearch()
  ])
  const entry = Tab.currentEntry(state)
  expect(entry.program).toEqual("fourth")
})

test("back, back, push, back", () => {
  let state = store.dispatchAll([
    History.back(),
    History.back(),
    SearchBar.changeSearchBarInput("fourth"),
    submitSearch(),
    History.back()
  ])
  const entry = Tab.currentEntry(state)
  expect(entry.program).toEqual("first")
})

test("clearing history", () => {
  let state = store.dispatchAll([History.clear()])
  expect(Tab.currentEntry(state)).toBe(undefined)
})
