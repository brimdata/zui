/* @flow */

import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryInclude
} from "../../flows/searchBar/actions"
import {
  changeSearchBarInput,
  clearSearchBar,
  editSearchBarPin,
  errorSearchBarParse,
  pinSearchBar,
  removeAllSearchBarPins,
  removeSearchBarPin,
  restoreSearchBar,
  submittingSearchBar
} from "../actions"
import {
  getSearchProgram,
  getSearchBar,
  getSearchBarEditingIndex,
  getSearchBarError,
  getSearchBarInputValue,
  getSearchBarPins,
  getSearchBarPreviousInputValue
} from "../selectors/searchBar"
import {goBack, goForward, submitSearchBar} from "../thunks/searchBar"
import {initialState} from "./searchBar"
import Field from "../../models/Field"
import initTestStore from "../../test/initTestStore"
import search from "../search"

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

test("editing a pin to an empty string removes it", () => {
  let state = store.dispatchAll([
    changeSearchBarInput("first"),
    pinSearchBar(),
    editSearchBarPin(0),
    changeSearchBarInput(""),
    submitSearchBar()
  ])

  expect(getSearchBar(state)).toEqual(
    expect.objectContaining({
      current: "",
      previous: "",
      pinned: [],
      editing: null
    })
  )
})

test("search pin edit with null removes editing index", () => {
  let state = store.dispatchAll([
    changeSearchBarInput("first"),
    pinSearchBar(),
    changeSearchBarInput("second"),
    pinSearchBar(),
    changeSearchBarInput("third"),
    submitSearchBar(),
    editSearchBarPin(1),
    changeSearchBarInput("second (edited)"),
    editSearchBarPin(null),
    changeSearchBarInput("third (edited)")
  ])

  expect(getSearchBar(state)).toEqual(
    expect.objectContaining({
      pinned: ["first", "second (edited)"],
      current: "third (edited)",
      previous: "third",
      editing: null
    })
  )
})

test("search pin edit then submiting", () => {
  let state = store.dispatchAll([
    changeSearchBarInput("first"),
    pinSearchBar(),
    changeSearchBarInput("second"),
    pinSearchBar(),
    changeSearchBarInput("third"),
    submitSearchBar(),
    editSearchBarPin(0),
    changeSearchBarInput("first (edited)"),
    submitSearchBar()
  ])

  expect(getSearchBar(state)).toEqual(
    expect.objectContaining({
      current: "first (edited)",
      previous: "third",
      pinned: ["first (edited)", "second"],
      editing: 0
    })
  )
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

test("append an include field", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  const state = store.dispatchAll([appendQueryInclude(field)])

  expect(getSearchBarInputValue(state)).toBe('_path="conn"')
})

test("append an include field when some text already exists", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  let state = store.dispatchAll([
    changeSearchBarInput("text"),
    appendQueryInclude(field)
  ])
  expect(getSearchBarInputValue(state)).toBe('text _path="conn"')
})

test("append an exclude field", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  let state = store.dispatchAll([appendQueryExclude(field)])
  expect(getSearchBarInputValue(state)).toBe('_path!="conn"')
})

test("append an exclude field when some text already exists", () => {
  const field = new Field({name: "_path", type: "string", value: "conn"})
  let state = store.dispatchAll([
    changeSearchBarInput("text"),
    appendQueryExclude(field)
  ])
  expect(getSearchBarInputValue(state)).toBe('text _path!="conn"')
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

test("edit pin then submit search", () => {
  let state = store.dispatchAll([
    changeSearchBarInput("192.168.0.54"),
    submitSearchBar(),
    pinSearchBar(),
    changeSearchBarInput("| count() by _path"),
    submitSearchBar(),
    editSearchBarPin(0),
    changeSearchBarInput("192.168.0.51"),
    submitSearchBar()
  ])
  expect(getSearchProgram(state)).toBe("192.168.0.51 | count() by _path")
})

test("get search program", () => {
  let state = store.dispatchAll([
    changeSearchBarInput("http"),
    pinSearchBar(),
    changeSearchBarInput("GET"),
    pinSearchBar(),
    changeSearchBarInput("| count() by host"),
    submitSearchBar()
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
    search.setSpanArgsFromDates([new Date(1), new Date(2)]),
    submitSearchBar(),
    changeSearchBarInput("goodbye"),
    search.setSpanArgsFromDates([new Date(3), new Date(4)]),
    submitSearchBar(),
    goBack()
  ])

  expect(search.getSpanAsDates(state)).toEqual([new Date(1), new Date(2)])
  expect(getSearchBarInputValue(state)).toBe("hello")
})

test("goForward", () => {
  const state = store.dispatchAll([
    changeSearchBarInput("hello"),
    search.setSpanArgsFromDates([new Date(1), new Date(2)]),
    submitSearchBar(),
    changeSearchBarInput("goodbye"),
    search.setSpanArgsFromDates([new Date(3), new Date(4)]),
    submitSearchBar(),
    changeSearchBarInput("hello again"),
    search.setSpanArgsFromDates([new Date(5), new Date(6)]),
    submitSearchBar(),
    goBack(),
    goBack(),
    goBack(),
    goBack(),
    goBack(),
    goForward()
  ])

  expect(getSearchBarInputValue(state)).toBe("goodbye")
  expect(search.getSpanAsDates(state)).toEqual([new Date(3), new Date(4)])
})

test("clearSearchBar", () => {
  const state = store.dispatchAll([
    changeSearchBarInput("hello"),
    clearSearchBar()
  ])

  expect(getSearchBar(state)).toEqual(initialState)
})
