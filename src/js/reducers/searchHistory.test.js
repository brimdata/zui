/* @flow */

import {
  backSearchHistory,
  clearSearchHistory,
  forwardSearchHistory
} from "../actions/searchHistory"
import {changeSearchBarInput} from "../actions/searchBar"
import {fetchMainSearch} from "../actions/mainSearch"
import {getCurrentEntry, getSearchHistory} from "./searchHistory"
import initTestStore from "../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
  store.dispatchAll([
    changeSearchBarInput("first"),
    fetchMainSearch(),
    changeSearchBarInput("second"),
    fetchMainSearch(),
    changeSearchBarInput("third"),
    fetchMainSearch()
  ])
})

test("pushing history", () => {
  const state = store.getState()
  const entry = getCurrentEntry(state)
  expect(entry.searchBar.current).toEqual("third")
})

test("moving back changes the position", () => {
  let state = store.dispatchAll([backSearchHistory()])
  const entry = getCurrentEntry(state)
  expect(entry.searchBar.current).toEqual("second")
})

test("going forward in history", () => {
  let state = store.dispatchAll([
    backSearchHistory(),
    backSearchHistory(),
    forwardSearchHistory()
  ])
  const entry = getCurrentEntry(state)
  expect(entry.searchBar.current).toEqual("second")
})

test("going back in history then pushing new history", () => {
  let state = store.dispatchAll([
    backSearchHistory(),
    backSearchHistory(),
    changeSearchBarInput("fourth"),
    fetchMainSearch()
  ])
  const entry = getCurrentEntry(state)
  expect(entry.searchBar.current).toEqual("fourth")
})

test("back, back, push, back", () => {
  let state = store.dispatchAll([
    backSearchHistory(),
    backSearchHistory(),
    changeSearchBarInput("fourth"),
    fetchMainSearch(),
    backSearchHistory()
  ])
  const entry = getCurrentEntry(state)
  expect(entry.searchBar.current).toEqual("first")
})

test("clearing history", () => {
  let state = store.dispatchAll([clearSearchHistory()])
  expect(getSearchHistory(state)).toEqual({position: -1, entries: []})
})
