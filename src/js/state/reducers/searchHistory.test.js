/* @flow */

import {
  backSearchHistory,
  changeSearchBarInput,
  clearSearchHistory,
  forwardSearchHistory
} from "../actions"
import {getCurrentEntry, getSearchHistory} from "./searchHistory"
import {submitSearchBar} from "../thunks/searchBar"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
  store.dispatchAll([
    changeSearchBarInput("first"),
    submitSearchBar(),
    changeSearchBarInput("second"),
    submitSearchBar(),
    changeSearchBarInput("third"),
    submitSearchBar()
  ])
})

test("pushing history", () => {
  const state = store.getState()
  const entry = getCurrentEntry(state)
  expect(entry.program).toEqual("third")
})

test("moving back changes the position", () => {
  let state = store.dispatchAll([backSearchHistory()])
  const entry = getCurrentEntry(state)
  expect(entry.program).toEqual("second")
})

test("going forward in history", () => {
  let state = store.dispatchAll([
    backSearchHistory(),
    backSearchHistory(),
    forwardSearchHistory()
  ])
  const entry = getCurrentEntry(state)
  expect(entry.program).toEqual("second")
})

test("going back in history then pushing new history", () => {
  let state = store.dispatchAll([
    backSearchHistory(),
    backSearchHistory(),
    changeSearchBarInput("fourth"),
    submitSearchBar()
  ])
  const entry = getCurrentEntry(state)
  expect(entry.program).toEqual("fourth")
})

test("back, back, push, back", () => {
  let state = store.dispatchAll([
    backSearchHistory(),
    backSearchHistory(),
    changeSearchBarInput("fourth"),
    submitSearchBar(),
    backSearchHistory()
  ])
  const entry = getCurrentEntry(state)
  expect(entry.program).toEqual("first")
})

test("clearing history", () => {
  let state = store.dispatchAll([clearSearchHistory()])
  expect(getSearchHistory(state)).toEqual({position: -1, entries: []})
})
