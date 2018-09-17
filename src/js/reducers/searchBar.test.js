import reducer, {
  initialState,
  getSearchProgram,
  getSearchBarError,
  getSearchBarInputValue,
  getSearchBarPins,
  getSearchBarEditingIndex,
  getSearchBarPreviousInputValue
} from "./searchBar"
import * as actions from "../actions/searchBar"

const reduce = actions => ({searchBar: actions.reduce(reducer, initialState)})

test("input value changed", () => {
  const state = reduce([actions.changeSearchBarInput("duration > 10")])

  expect(getSearchBarInputValue(state)).toBe("duration > 10")
})

test("search pinned", () => {
  let state = reduce([
    actions.changeSearchBarInput("_path = http"),
    actions.pinSearchBar()
  ])

  expect(getSearchBarInputValue(state)).toBe("")
  expect(getSearchBarPins(state)).toEqual(["_path = http"])
})

test("search pin does not work if current is empty", () => {
  let state = reduce([actions.pinSearchBar()])

  expect(getSearchBarPins(state)).toEqual([])
})

test("search pin does not work if current is a bunch of white space", () => {
  let state = reduce([
    actions.changeSearchBarInput("     "),
    actions.pinSearchBar()
  ])
  expect(getSearchBarPins(state)).toEqual([])
})

test("search pin edit sets the editing index", () => {
  let state = reduce([
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
    reducer(initialState, actions.editSearchBarPin(100))
  }).toThrow("Trying to edit a pin that does not exist: 100")
})

test("search bar pin remove", () => {
  const state = reduce([
    actions.changeSearchBarInput("first pin"),
    actions.pinSearchBar(),
    actions.removeSearchBarPin(0)
  ])

  expect(getSearchBarPins(state)).toEqual([])
})

test("search bar pin remove when out of bounds", () => {
  expect(() => reducer(initialState, actions.removeSearchBarPin(100))).toThrow(
    "Trying to remove a pin that does not exist: 100"
  )
})

test("search bar submit", () => {
  let state = reduce([
    actions.changeSearchBarInput("conn"),
    actions.submittingSearchBar()
  ])

  expect(getSearchBarInputValue(state)).toBe("conn")
  expect(getSearchBarPreviousInputValue(state)).toBe("conn")
  expect(getSearchBarEditingIndex(state)).toBe(null)
})

test("search bar submit after editing resets editing", () => {
  let state = reduce([
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
  const state = reduce([actions.appendQueryInclude("_path", "conn")])

  expect(getSearchBarInputValue(state)).toBe("_path=conn")
})

test("append an include field when some text already exists", () => {
  let state = reduce([
    actions.changeSearchBarInput("text"),
    actions.appendQueryInclude("_path", "conn")
  ])
  expect(getSearchBarInputValue(state)).toBe("text _path=conn")
})

test("append an exclude field", () => {
  let state = reduce([actions.appendQueryExclude("_path", "conn")])
  expect(getSearchBarInputValue(state)).toBe("_path!=conn")
})

test("append an exclude field when some text already exists", () => {
  let state = reduce([
    actions.changeSearchBarInput("text"),
    actions.appendQueryExclude("_path", "conn")
  ])
  expect(getSearchBarInputValue(state)).toBe("text _path!=conn")
})

test("append a count by field", () => {
  let state = reduce([actions.appendQueryCountBy("_path")])
  expect(getSearchBarInputValue(state)).toBe("* | count() by _path")
})

test("append a count to an existing query", () => {
  let state = reduce([
    actions.changeSearchBarInput("dns"),
    actions.appendQueryCountBy("query")
  ])
  expect(getSearchBarInputValue(state)).toBe("dns | count() by query")
})

test("get search program", () => {
  let state = reduce([
    actions.changeSearchBarInput("http"),
    actions.pinSearchBar(),
    actions.changeSearchBarInput("GET"),
    actions.pinSearchBar(),
    actions.changeSearchBarInput("| count() by host")
  ])
  expect(getSearchProgram(state)).toBe("http GET | count() by host")
})

test("get search program returns star when empty", () => {
  const state = reduce([{}])
  expect(getSearchProgram(state)).toBe("*")
})

test("a search bar error", () => {
  const state = reduce([actions.errorSearchBarParse("not a valid shin dig")])

  expect(getSearchBarError(state)).toBe("not a valid shin dig")
})

test("remove all pins", () => {
  let state = reduce([
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
