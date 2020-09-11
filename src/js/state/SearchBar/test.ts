import {createZealotMock} from "zealot"

import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryInclude
} from "../../flows/searchBar/actions"
import {submitSearch} from "../../flows/submitSearch/mod"
import Clusters from "../Clusters"
import Current from "../Current"
import Search from "../Search"
import SearchBar from "./"
import Spaces from "../Spaces"
import Tab from "../Tab"
import fixtures from "../../test/fixtures"
import initTestStore from "../../test/initTestStore"
import {SearchBarState} from "./types"

let store
beforeEach(() => {
  store = initTestStore(
    createZealotMock().stubStream("search", [{type: "TaskEnd"}])
  )
  const conn = fixtures("cluster1")
  const space = fixtures("space1")

  store.dispatchAll([
    Clusters.add(conn),
    Spaces.setDetail(conn.id, space),
    Current.setConnectionId(conn.id),
    Current.setSpaceId(space.id)
  ])
})

test("input value changed", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("duration > 10")
  ])

  expect(SearchBar.getSearchBarInputValue(state)).toBe("duration > 10")
})

test("search pinned", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("_path = http"),
    SearchBar.pinSearchBar()
  ])

  expect(SearchBar.getSearchBarInputValue(state)).toBe("")
  expect(SearchBar.getSearchBarPins(state)).toEqual(["_path = http"])
})

test("search pin does not work if current is empty", () => {
  const state = store.dispatchAll([SearchBar.pinSearchBar()])

  expect(SearchBar.getSearchBarPins(state)).toEqual([])
})

test("search pin does not work if current is a bunch of white space", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("     "),
    SearchBar.pinSearchBar()
  ])
  expect(SearchBar.getSearchBarPins(state)).toEqual([])
})

test("search pin edit sets the editing index", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("first pin"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("second pin"),
    SearchBar.pinSearchBar(),
    SearchBar.editSearchBarPin(1)
  ])

  expect(SearchBar.getSearchBarEditingIndex(state)).toBe(1)
})

test("editing a pin to an empty string removes it", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("first"),
    SearchBar.pinSearchBar(),
    SearchBar.editSearchBarPin(0),
    SearchBar.changeSearchBarInput(""),
    submitSearch()
  ])

  expect(SearchBar.getSearchBar(state)).toEqual(
    expect.objectContaining({
      current: "",
      previous: "",
      pinned: [],
      editing: null
    })
  )
})

test("search pin edit with null removes editing index", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("first"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("second"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("third"),
    submitSearch(),
    SearchBar.editSearchBarPin(1),
    SearchBar.changeSearchBarInput("second (edited)"),
    SearchBar.editSearchBarPin(null),
    SearchBar.changeSearchBarInput("third (edited)")
  ])

  expect(SearchBar.getSearchBar(state)).toEqual(
    expect.objectContaining({
      pinned: ["first", "second (edited)"],
      current: "third (edited)",
      previous: "third",
      editing: null
    })
  )
})

test("search pin edit then submiting", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("first"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("second"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("third"),
    SearchBar.submittingSearchBar(),
    SearchBar.editSearchBarPin(0),
    SearchBar.changeSearchBarInput("first (edited)"),
    SearchBar.submittingSearchBar()
  ])

  expect(SearchBar.getSearchBar(state)).toEqual(
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
    store.dispatch(SearchBar.editSearchBarPin(100))
  }).toThrow("Trying to edit a pin that does not exist: 100")
})

test("search bar pin remove", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("first pin"),
    SearchBar.pinSearchBar(),
    SearchBar.removeSearchBarPin(0)
  ])

  expect(SearchBar.getSearchBarPins(state)).toEqual([])
})

test("search bar pin remove when out of bounds", () => {
  expect(() => store.dispatch(SearchBar.removeSearchBarPin(100))).toThrow(
    "Trying to remove a pin that does not exist: 100"
  )
})

test("search bar submit", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("conn"),
    SearchBar.submittingSearchBar()
  ])

  expect(SearchBar.getSearchBarInputValue(state)).toBe("conn")
  expect(SearchBar.getSearchBarPreviousInputValue(state)).toBe("conn")
  expect(SearchBar.getSearchBarEditingIndex(state)).toBe(null)
})

test("append an include field", () => {
  const field = {name: "_path", type: "string", value: "conn"}
  const state = store.dispatchAll([appendQueryInclude(field)])

  expect(SearchBar.getSearchBarInputValue(state)).toBe('_path="conn"')
})

test("append an include field when some text already exists", () => {
  const field = {name: "_path", type: "string", value: "conn"}
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("text"),
    appendQueryInclude(field)
  ])
  expect(SearchBar.getSearchBarInputValue(state)).toBe('text _path="conn"')
})

test("append an exclude field", () => {
  const field = {name: "_path", type: "string", value: "conn"}
  const state = store.dispatchAll([appendQueryExclude(field)])
  expect(SearchBar.getSearchBarInputValue(state)).toBe('_path!="conn"')
})

test("append an exclude field when some text already exists", () => {
  const field = {name: "_path", type: "string", value: "conn"}
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("text"),
    appendQueryExclude(field)
  ])
  expect(SearchBar.getSearchBarInputValue(state)).toBe('text _path!="conn"')
})

test("append a count by field", () => {
  const field = {name: "_path", type: "string", value: "conn"}
  const state = store.dispatchAll([appendQueryCountBy(field)])
  expect(SearchBar.getSearchBarInputValue(state)).toBe("* | count() by _path")
})

test("append a count to an existing query", () => {
  const field = {name: "query", type: "string", value: "heyyo"}
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("dns"),
    appendQueryCountBy(field)
  ])
  expect(SearchBar.getSearchBarInputValue(state)).toBe("dns | count() by query")
})

test("append a count to an existing query with a pin", () => {
  const field = {name: "query", type: "string", value: "heyyo"}
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("dns"),
    SearchBar.pinSearchBar(),
    appendQueryCountBy(field)
  ])
  expect(SearchBar.getSearchBarInputValue(state)).toBe("| count() by query")
})

test("edit pin then submit search", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("192.168.0.54"),
    submitSearch(),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("| count() by _path"),
    submitSearch(),
    SearchBar.editSearchBarPin(0),
    SearchBar.changeSearchBarInput("192.168.0.51"),
    submitSearch()
  ])
  expect(SearchBar.getSearchProgram(state)).toBe(
    "192.168.0.51 | count() by _path"
  )
})

test("get search program", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("http"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("GET"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("| count() by host"),
    submitSearch()
  ])
  expect(SearchBar.getSearchProgram(state)).toBe("http GET | count() by host")
})

test("get search program returns star when empty", () => {
  const state = store.getState()
  expect(SearchBar.getSearchProgram(state)).toBe("*")
})

test("a search bar error", () => {
  const state = store.dispatchAll([
    SearchBar.errorSearchBarParse("not a valid shin dig")
  ])

  expect(SearchBar.getSearchBarError(state)).toBe("not a valid shin dig")
})

test("remove all pins", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("hello"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("world"),
    SearchBar.pinSearchBar(),
    SearchBar.changeSearchBarInput("keep me"),
    SearchBar.submittingSearchBar(),
    SearchBar.removeAllSearchBarPins()
  ])

  expect(SearchBar.getSearchBarInputValue(state)).toBe("keep me")
  expect(SearchBar.getSearchBarPreviousInputValue(state)).toBe("")
  expect(SearchBar.getSearchBarPins(state)).toEqual([])
})

test("restore", () => {
  const slice: SearchBarState = {
    current: "restore",
    previous: "me",
    pinned: ["real", "quick"],
    editing: null,
    error: null,
    target: "events"
  }
  const state = store.dispatchAll([SearchBar.restoreSearchBar(slice)])

  expect(SearchBar.getSearchBarInputValue(state)).toBe("restore")
  expect(SearchBar.getSearchBarPreviousInputValue(state)).toBe("me")
  expect(SearchBar.getSearchBarPins(state)).toEqual(["real", "quick"])
  expect(SearchBar.getSearchBarError(state)).toBe(null)
  expect(SearchBar.getSearchBarEditingIndex(state)).toBe(null)
})

test("goBack", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("hello"),
    Search.setSpanArgsFromDates([new Date(1), new Date(2)]),
    submitSearch(),
    SearchBar.changeSearchBarInput("goodbye"),
    Search.setSpanArgsFromDates([new Date(3), new Date(4)]),
    submitSearch(),
    SearchBar.goBack()
  ])

  expect(Tab.getSpanAsDates(state)).toEqual([new Date(1), new Date(2)])
  expect(SearchBar.getSearchBarInputValue(state)).toBe("hello")
})

test("goForward", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("hello"),
    Search.setSpanArgsFromDates([new Date(1), new Date(2)]),
    submitSearch(),
    SearchBar.changeSearchBarInput("goodbye"),
    Search.setSpanArgsFromDates([new Date(3), new Date(4)]),
    submitSearch(),
    SearchBar.changeSearchBarInput("hello again"),
    Search.setSpanArgsFromDates([new Date(5), new Date(6)]),
    submitSearch(),
    SearchBar.goBack(),
    SearchBar.goBack(),
    SearchBar.goBack(),
    SearchBar.goBack(),
    SearchBar.goBack(),
    SearchBar.goForward()
  ])

  expect(SearchBar.getSearchBarInputValue(state)).toBe("goodbye")
  expect(Tab.getSpanAsDates(state)).toEqual([new Date(3), new Date(4)])
})

test("clearSearchBar", () => {
  const state = store.dispatchAll([
    SearchBar.changeSearchBarInput("hello"),
    SearchBar.clearSearchBar()
  ])

  expect(SearchBar.getSearchBar(state)).toEqual(
    expect.objectContaining({
      current: "",
      editing: null,
      error: null,
      pinned: [],
      previous: ""
    })
  )
})

test("setTarget initial state", () => {
  const state = store.getState()

  expect(SearchBar.getTarget(state)).toBe("events")
})

test("setTarget to index", () => {
  store.dispatch(SearchBar.setTarget("index"))
  const state = store.getState()

  expect(SearchBar.getTarget(state)).toBe("index")
})
