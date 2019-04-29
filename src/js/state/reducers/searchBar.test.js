/* @flow */

import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryInclude,
  changeSearchBarInput,
  clearSearchBar,
  editSearchBarPin,
  errorSearchBarParse,
  pinSearchBar,
  removeAllSearchBarPins,
  removeSearchBarPin,
  restoreSearchBar,
  setOuterTimeWindow,
  submittingSearchBar
} from "../actions"
import {getOuterTimeWindow} from "./timeWindow"
import {
  getSearchBar,
  getSearchBarEditingIndex,
  getSearchBarError,
  getSearchBarInputValue,
  getSearchBarPins,
  getSearchBarPreviousInputValue,
  getSearchProgram
} from "../selectors/searchBar"
import {goBack, goForward, submitSearchBar} from "../thunks/searchBar"
import {initialState} from "./searchBar"
import Field from "../../models/Field"
import initTestStore from "../../test/initTestStore"

let store
beforeEach(() => {
  store = initTestStore()
})

test("input value changed", () => {
  const state = store.dispatchAll([changeSearchBarInput("duration > 10")])

  expect(getSearchBarInputValue(state)).toBe("duration > 10")
})

test("search pinned", () => {
  let state = store.dispatchAll([
    changeSearchBarInput("_path = http"),
    pinSearchBar()
  ])

  expect(getSearchBarInputValue(state)).toBe("")
  expect(getSearchBarPins(state)).toEqual(["_path = http"])
})

test("search pin does not work if current is empty", () => {
  let state = store.dispatchAll([pinSearchBar()])

  expect(getSearchBarPins(state)).toEqual([])
})

test("search pin does not work if current is a bunch of white space", () => {
  let state = store.dispatchAll([changeSearchBarInput("     "), pinSearchBar()])
  expect(getSearchBarPins(state)).toEqual([])
})

test("search pin edit sets the editing index", () => {
  let state = store.dispatchAll([
    changeSearchBarInput("first pin"),
    pinSearchBar(),
    changeSearchBarInput("second pin"),
    pinSearchBar(),
    editSearchBarPin(1)
  ])

  expect(getSearchBarEditingIndex(state)).toBe(1)
})

test("search pin edit does not set index if out of bounds", () => {
  expect(() => {
    store.dispatch(editSearchBarPin(100))
  }).toThrow("Trying to edit a pin that does not exist: 100")
})

test("search bar pin remove", () => {
  const state = store.dispatchAll([
    changeSearchBarInput("first pin"),
    pinSearchBar(),
    removeSearchBarPin(0)
  ])

  expect(getSearchBarPins(state)).toEqual([])
})

test("search bar pin remove when out of bounds", () => {
  expect(() => store.dispatch(removeSearchBarPin(100))).toThrow(
    "Trying to remove a pin that does not exist: 100"
  )
})

test("search bar submit", () => {
  let state = store.dispatchAll([
    changeSearchBarInput("conn"),
    submittingSearchBar()
  ])

  expect(getSearchBarInputValue(state)).toBe("conn")
  expect(getSearchBarPreviousInputValue(state)).toBe("conn")
  expect(getSearchBarEditingIndex(state)).toBe(null)
})

test("search bar submit after editing resets editing", () => {
  let state = store.dispatchAll([
    changeSearchBarInput("http"),
    pinSearchBar(),
    editSearchBarPin(0),
    changeSearchBarInput("https"),
    submittingSearchBar()
  ])

  expect(getSearchBarInputValue(state)).toBe("")
  expect(getSearchBarPins(state)[0]).toBe("https")
})

test("append an include field", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  const state = store.dispatchAll([appendQueryInclude(field)])

  expect(getSearchBarInputValue(state)).toBe("_path=conn")
})

test("append an include field when some text already exists", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  let state = store.dispatchAll([
    changeSearchBarInput("text"),
    appendQueryInclude(field)
  ])
  expect(getSearchBarInputValue(state)).toBe("text _path=conn")
})

test("append an exclude field", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  let state = store.dispatchAll([appendQueryExclude(field)])
  expect(getSearchBarInputValue(state)).toBe("_path!=conn")
})

test("append an exclude field when some text already exists", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  let state = store.dispatchAll([
    changeSearchBarInput("text"),
    appendQueryExclude(field)
  ])
  expect(getSearchBarInputValue(state)).toBe("text _path!=conn")
})

test("append a count by field", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  let state = store.dispatchAll([appendQueryCountBy(field)])
  expect(getSearchBarInputValue(state)).toBe("* | count() by _path")
})

test("append a count to an existing query", () => {
  const field = new Field({name: "query", type: "string", value: "heyyo"})
  let state = store.dispatchAll([
    changeSearchBarInput("dns"),
    appendQueryCountBy(field)
  ])
  expect(getSearchBarInputValue(state)).toBe("dns | count() by query")
})

test("append a count to an existing query with a pin", () => {
  const field = new Field({name: "query", type: "string", value: "heyyo"})
  let state = store.dispatchAll([
    changeSearchBarInput("dns"),
    pinSearchBar(),
    appendQueryCountBy(field)
  ])
  expect(getSearchBarInputValue(state)).toBe("| count() by query")
})

test("get search program", () => {
  let state = store.dispatchAll([
    changeSearchBarInput("http"),
    pinSearchBar(),
    changeSearchBarInput("GET"),
    pinSearchBar(),
    changeSearchBarInput("| count() by host")
  ])
  expect(getSearchProgram(state)).toBe("http GET | count() by host")
})

test("get search program returns star when empty", () => {
  const state = store.getState()
  expect(getSearchProgram(state)).toBe("*")
})

test("a search bar error", () => {
  const state = store.dispatchAll([errorSearchBarParse("not a valid shin dig")])

  expect(getSearchBarError(state)).toBe("not a valid shin dig")
})

test("remove all pins", () => {
  let state = store.dispatchAll([
    changeSearchBarInput("hello"),
    pinSearchBar(),
    changeSearchBarInput("world"),
    pinSearchBar(),
    changeSearchBarInput("keep me"),
    submittingSearchBar(),
    removeAllSearchBarPins()
  ])

  expect(getSearchBarInputValue(state)).toBe("keep me")
  expect(getSearchBarPreviousInputValue(state)).toBe("")
  expect(getSearchBarPins(state)).toEqual([])
})

test("restore", () => {
  const slice = {
    current: "restore",
    previous: "me",
    pinned: ["real", "quick"],
    editing: null,
    error: null
  }
  const state = store.dispatchAll([restoreSearchBar(slice)])

  expect(getSearchBarInputValue(state)).toBe("restore")
  expect(getSearchBarPreviousInputValue(state)).toBe("me")
  expect(getSearchBarPins(state)).toEqual(["real", "quick"])
  expect(getSearchBarError(state)).toBe(null)
  expect(getSearchBarEditingIndex(state)).toBe(null)
})

test("goBack", () => {
  const state = store.dispatchAll([
    changeSearchBarInput("hello"),
    setOuterTimeWindow([new Date(1), new Date(2)]),
    submitSearchBar(),
    changeSearchBarInput("goodbye"),
    setOuterTimeWindow([new Date(3), new Date(4)]),
    submitSearchBar(),
    goBack()
  ])

  expect(getOuterTimeWindow(state)).toEqual([new Date(1), new Date(2)])
  expect(getSearchBarInputValue(state)).toBe("hello")
})

test("goForward", () => {
  const state = store.dispatchAll([
    changeSearchBarInput("hello"),
    setOuterTimeWindow([new Date(1), new Date(2)]),
    submitSearchBar(),
    changeSearchBarInput("goodbye"),
    setOuterTimeWindow([new Date(3), new Date(4)]),
    submitSearchBar(),
    changeSearchBarInput("hello again"),
    setOuterTimeWindow([new Date(5), new Date(6)]),
    submitSearchBar(),
    goBack(),
    goBack(),
    goBack(),
    goBack(),
    goBack(),
    goForward()
  ])

  expect(getSearchBarInputValue(state)).toBe("goodbye")
  expect(getOuterTimeWindow(state)).toEqual([new Date(3), new Date(4)])
})

test("clearSearchBar", () => {
  const state = store.dispatchAll([
    changeSearchBarInput("hello"),
    clearSearchBar()
  ])

  expect(getSearchBar(state)).toEqual(initialState)
})
