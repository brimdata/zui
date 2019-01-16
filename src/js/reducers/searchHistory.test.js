/* @flow */
import initStore from "../test/initStore"
import * as searchHistory from "../actions/searchHistory"
import * as searchBar from "../actions/searchBar"
import {getCurrentEntry, getSearchHistory} from "./searchHistory"

let store
beforeEach(() => {
  store = initStore()
  store.dispatchAll([
    searchBar.changeSearchBarInput("first"),
    searchHistory.pushSearchHistory(),
    searchBar.changeSearchBarInput("second"),
    searchHistory.pushSearchHistory(),
    searchBar.changeSearchBarInput("third"),
    searchHistory.pushSearchHistory()
  ])
})

test("pushing history", () => {
  const state = store.getState()
  const entry = getCurrentEntry(state)
  expect(entry.searchBar.current).toEqual("third")
})

test("moving back changes the position", () => {
  let state = store.dispatchAll([searchHistory.backSearchHistory()])
  const entry = getCurrentEntry(state)
  expect(entry.searchBar.current).toEqual("second")
})

test("going forward in history", () => {
  let state = store.dispatchAll([
    searchHistory.backSearchHistory(),
    searchHistory.backSearchHistory(),
    searchHistory.forwardSearchHistory()
  ])
  const entry = getCurrentEntry(state)
  expect(entry.searchBar.current).toEqual("second")
})

test("going back in history then pushing new history", () => {
  let state = store.dispatchAll([
    searchHistory.backSearchHistory(),
    searchHistory.backSearchHistory(),
    searchBar.changeSearchBarInput("fourth"),
    searchHistory.pushSearchHistory()
  ])
  const entry = getCurrentEntry(state)
  expect(entry.searchBar.current).toEqual("fourth")
})

test("back, back, push, back", () => {
  let state = store.dispatchAll([
    searchHistory.backSearchHistory(),
    searchHistory.backSearchHistory(),
    searchBar.changeSearchBarInput("fourth"),
    searchHistory.pushSearchHistory(),
    searchHistory.backSearchHistory()
  ])
  const entry = getCurrentEntry(state)
  expect(entry.searchBar.current).toEqual("first")
})

test("clearing history", () => {
  let state = store.dispatchAll([searchHistory.clearSearchHistory()])
  expect(getSearchHistory(state)).toEqual({position: -1, entries: []})
})
