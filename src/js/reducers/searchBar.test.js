import reducer, {initialState} from "./searchBar"
import {requestMainSearch} from "../actions/mainSearch"
import * as actions from "../actions/searchBar"

test("input value changed", () => {
  const state = reducer(
    initialState,
    actions.changeSearchBarInput("duration > 10")
  )

  expect(state.current).toBe("duration > 10")
})

test("search pinned", () => {
  let state = reducer(
    initialState,
    actions.changeSearchBarInput("_path = http")
  )

  state = reducer(state, actions.pinSearchBar())

  expect(state.current).toBe("")
  expect(state.pinned).toEqual(["_path = http"])
})

test("search pin does not work if current is empty", () => {
  let state = reducer(initialState, actions.pinSearchBar())

  expect(state.pinned).toEqual([])
})

test("search pin does not work if current is a bunch of white space", () => {
  let state = reducer(initialState, actions.changeSearchBarInput("     "))
  state = reducer(state, actions.pinSearchBar())
  expect(state.pinned).toEqual([])
})

test("search pin edit sets the editing index", () => {
  let state = reducer(initialState, actions.changeSearchBarInput("first pin"))
  state = reducer(state, actions.pinSearchBar())
  state = reducer(state, actions.changeSearchBarInput("second pin"))
  state = reducer(state, actions.pinSearchBar())
  state = reducer(state, actions.editSearchBarPin(1))

  expect(state.editing).toBe(1)
})

test("search pin edit does not set index if out of bounds", () => {
  expect(() => {
    reducer(initialState, actions.editSearchBarPin(100))
  }).toThrow("Trying to edit a pin that does not exist: 100")
})

test("search bar pin remove", () => {
  let state = reducer(initialState, actions.changeSearchBarInput("first pin"))
  state = reducer(state, actions.pinSearchBar())
  state = reducer(state, actions.removeSearchBarPin(0))

  expect(state.pinned).toEqual([])
})

test("search bar pin remove when out of bounds", () => {
  expect(() => reducer(initialState, actions.removeSearchBarPin(100))).toThrow(
    "Trying to remove a pin that does not exist: 100"
  )
})

test("search bar submit", () => {
  let state = reducer(initialState, actions.changeSearchBarInput("conn"))
  state = reducer(state, requestMainSearch({}))

  expect(state.current).toBe("conn")
  expect(state.previous).toBe("conn")
  expect(state.editing).toBe(null)
})

test("search bar submit after editing resets editing", () => {
  let state = reducer(initialState, actions.changeSearchBarInput("http"))
  state = reducer(state, actions.pinSearchBar())
  state = reducer(state, actions.editSearchBarPin(0))
  state = reducer(state, actions.changeSearchBarInput("https"))
  state = reducer(state, requestMainSearch({}))

  expect(state.current).toBe("")
  expect(state.pinned[0]).toBe("https")
})

test("append an include field", () => {
  let state = reducer(initialState, actions.appendQueryInclude("_path", "conn"))
  expect(state.current).toBe("_path=conn")
})

test("append an include field when some text already exists", () => {
  let state = reducer(initialState, actions.changeSearchBarInput("text"))
  state = reducer(state, actions.appendQueryInclude("_path", "conn"))
  expect(state.current).toBe("text _path=conn")
})

test("append an exclude field", () => {
  let state = reducer(initialState, actions.appendQueryExclude("_path", "conn"))
  expect(state.current).toBe("_path!=conn")
})

test("append an exclude field when some text already exists", () => {
  let state = reducer(initialState, actions.changeSearchBarInput("text"))
  state = reducer(state, actions.appendQueryExclude("_path", "conn"))
  expect(state.current).toBe("text _path!=conn")
})

test("append a count by field", () => {
  let state = reducer(initialState, actions.appendQueryCountBy("_path"))
  expect(state.current).toBe("* | count() by _path")
})

test("append a count to an existing query", () => {
  let state = reducer(initialState, actions.changeSearchBarInput("dns"))
  state = reducer(state, actions.appendQueryCountBy("query"))
  expect(state.current).toBe("dns | count() by query")
})
