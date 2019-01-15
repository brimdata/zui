/* @flow */

import {
  getSearchProgram,
  getSearchBarError,
  getSearchBarInputValue,
  getSearchBarPins,
  getSearchBarEditingIndex,
  getSearchBarPreviousInputValue,
  getSearchBar
} from "../selectors/searchBar"
import {initialState} from "./searchBar"
import {getOuterTimeWindow} from "./timeWindow"
import * as actions from "../actions/searchBar"
import {setOuterTimeWindow} from "../actions/timeWindow"
import Field from "../models/Field"
import initStore from "../test/initStore"
import MockApi from "../test/MockApi"

let store
beforeEach(() => {
  store = initStore()
})

test("input value changed", () => {
  const state = store.dispatchAll([
    actions.changeSearchBarInput("duration > 10")
  ])

  expect(getSearchBarInputValue(state)).toBe("duration > 10")
})

test("search pinned", () => {
  let state = store.dispatchAll([
    actions.changeSearchBarInput("_path = http"),
    actions.pinSearchBar()
  ])

  expect(getSearchBarInputValue(state)).toBe("")
  expect(getSearchBarPins(state)).toEqual(["_path = http"])
})

test("search pin does not work if current is empty", () => {
  let state = store.dispatchAll([actions.pinSearchBar()])

  expect(getSearchBarPins(state)).toEqual([])
})

test("search pin does not work if current is a bunch of white space", () => {
  let state = store.dispatchAll([
    actions.changeSearchBarInput("     "),
    actions.pinSearchBar()
  ])
  expect(getSearchBarPins(state)).toEqual([])
})

test("search pin edit sets the editing index", () => {
  let state = store.dispatchAll([
    actions.changeSearchBarInput("first pin"),
    actions.pinSearchBar(),
    actions.changeSearchBarInput("second pin"),
    actions.pinSearchBar(),
    actions.editSearchBarPin(1)
  ])

  expect(getSearchBarEditingIndex(state)).toBe(1)
})

test("search pin edit does not set index if out of bounds", () => {
  expect(() => {
    store.dispatch(actions.editSearchBarPin(100))
  }).toThrow("Trying to edit a pin that does not exist: 100")
})

test("search bar pin remove", () => {
  const state = store.dispatchAll([
    actions.changeSearchBarInput("first pin"),
    actions.pinSearchBar(),
    actions.removeSearchBarPin(0)
  ])

  expect(getSearchBarPins(state)).toEqual([])
})

test("search bar pin remove when out of bounds", () => {
  expect(() => store.dispatch(actions.removeSearchBarPin(100))).toThrow(
    "Trying to remove a pin that does not exist: 100"
  )
})

test("search bar submit", () => {
  let state = store.dispatchAll([
    actions.changeSearchBarInput("conn"),
    actions.submittingSearchBar()
  ])

  expect(getSearchBarInputValue(state)).toBe("conn")
  expect(getSearchBarPreviousInputValue(state)).toBe("conn")
  expect(getSearchBarEditingIndex(state)).toBe(null)
})

test("search bar submit after editing resets editing", () => {
  let state = store.dispatchAll([
    actions.changeSearchBarInput("http"),
    actions.pinSearchBar(),
    actions.editSearchBarPin(0),
    actions.changeSearchBarInput("https"),
    actions.submittingSearchBar()
  ])

  expect(getSearchBarInputValue(state)).toBe("")
  expect(getSearchBarPins(state)[0]).toBe("https")
})

test("append an include field", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  const state = store.dispatchAll([actions.appendQueryInclude(field)])

  expect(getSearchBarInputValue(state)).toBe("_path=conn")
})

test("append an include field when some text already exists", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  let state = store.dispatchAll([
    actions.changeSearchBarInput("text"),
    actions.appendQueryInclude(field)
  ])
  expect(getSearchBarInputValue(state)).toBe("text _path=conn")
})

test("append an exclude field", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  let state = store.dispatchAll([actions.appendQueryExclude(field)])
  expect(getSearchBarInputValue(state)).toBe("_path!=conn")
})

test("append an exclude field when some text already exists", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  let state = store.dispatchAll([
    actions.changeSearchBarInput("text"),
    actions.appendQueryExclude(field)
  ])
  expect(getSearchBarInputValue(state)).toBe("text _path!=conn")
})

test("append a count by field", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  let state = store.dispatchAll([actions.appendQueryCountBy(field)])
  expect(getSearchBarInputValue(state)).toBe("* | count() by _path")
})

test("append a count to an existing query", () => {
  const field = new Field({name: "query", type: "string", value: "heyyo"})
  let state = store.dispatchAll([
    actions.changeSearchBarInput("dns"),
    actions.appendQueryCountBy(field)
  ])
  expect(getSearchBarInputValue(state)).toBe("dns | count() by query")
})

test("get search program", () => {
  let state = store.dispatchAll([
    actions.changeSearchBarInput("http"),
    actions.pinSearchBar(),
    actions.changeSearchBarInput("GET"),
    actions.pinSearchBar(),
    actions.changeSearchBarInput("| count() by host")
  ])
  expect(getSearchProgram(state)).toBe("http GET | count() by host")
})

test("get search program returns star when empty", () => {
  const state = store.getState()
  expect(getSearchProgram(state)).toBe("*")
})

test("a search bar error", () => {
  const state = store.dispatchAll([
    actions.errorSearchBarParse("not a valid shin dig")
  ])

  expect(getSearchBarError(state)).toBe("not a valid shin dig")
})

test("remove all pins", () => {
  let state = store.dispatchAll([
    actions.changeSearchBarInput("hello"),
    actions.pinSearchBar(),
    actions.changeSearchBarInput("world"),
    actions.pinSearchBar(),
    actions.changeSearchBarInput("keep me"),
    actions.submittingSearchBar(),
    actions.removeAllSearchBarPins()
  ])

  expect(getSearchBarInputValue(state)).toBe("keep me")
  expect(getSearchBarPreviousInputValue(state)).toBe("")
  expect(getSearchBarPins(state)).toEqual([])
})

test("restore", () => {
  const store = initStore()
  const slice = {
    current: "restore",
    previous: "me",
    pinned: ["real", "quick"],
    editing: null,
    error: null
  }
  const state = store.dispatchAll([actions.restoreSearchBar(slice)])

  expect(getSearchBarInputValue(state)).toBe("restore")
  expect(getSearchBarPreviousInputValue(state)).toBe("me")
  expect(getSearchBarPins(state)).toEqual(["real", "quick"])
  expect(getSearchBarError(state)).toBe(null)
  expect(getSearchBarEditingIndex(state)).toBe(null)
})

test("goBack", () => {
  const store = initStore(new MockApi())
  const state = store.dispatchAll([
    actions.changeSearchBarInput("hello"),
    setOuterTimeWindow([new Date(1), new Date(2)]),
    actions.submitSearchBar(),
    actions.changeSearchBarInput("goodbye"),
    setOuterTimeWindow([new Date(3), new Date(4)]),
    actions.submitSearchBar(),
    actions.goBack()
  ])

  expect(getOuterTimeWindow(state)).toEqual([new Date(1), new Date(2)])
  expect(getSearchBarInputValue(state)).toBe("hello")
})

test("goForward", () => {
  const store = initStore(new MockApi())
  const state = store.dispatchAll([
    actions.changeSearchBarInput("hello"),
    setOuterTimeWindow([new Date(1), new Date(2)]),
    actions.submitSearchBar(),
    actions.changeSearchBarInput("goodbye"),
    setOuterTimeWindow([new Date(3), new Date(4)]),
    actions.submitSearchBar(),
    actions.changeSearchBarInput("hello again"),
    setOuterTimeWindow([new Date(5), new Date(6)]),
    actions.submitSearchBar(),
    actions.goBack(),
    actions.goBack(),
    actions.goBack(),
    actions.goBack(),
    actions.goBack(),
    actions.goForward()
  ])

  expect(getSearchBarInputValue(state)).toBe("goodbye")
  expect(getOuterTimeWindow(state)).toEqual([new Date(3), new Date(4)])
})

test("clearSearchBar", () => {
  const store = initStore()
  const state = store.dispatchAll([
    actions.changeSearchBarInput("hello"),
    actions.clearSearchBar()
  ])

  expect(getSearchBar(state)).toEqual(initialState)
})
