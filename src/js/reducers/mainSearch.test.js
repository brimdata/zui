import * as actions from "../actions/mainSearch"
import initStore from "../test/initStore"
import * as mainSearch from "./mainSearch"

test("REQUEST resets the data", () => {
  const store = initStore()
  const state = store.dispatchAll([
    actions.mainSearchEvents(["hiii"]),
    actions.requestMainSearch()
  ])

  expect(mainSearch.getMainSearchEvents(state)).toEqual([])
})

test("request resets the stats to fetching", () => {
  const store = initStore()
  const state = store.dispatchAll([actions.requestMainSearch()])

  expect(mainSearch.getMainSearchIsFetching(state)).toBe(true)
})

test("MAIN_SEARCH_EVENTS appents items to the state", () => {
  const store = initStore()
  const state2 = store.dispatchAll([actions.mainSearchEvents(["item1"])])

  expect(mainSearch.getMainSearchEvents(state2)).toEqual(["item1"])
})

test("MAIN_SEARCH_EVENTS appents items to the state when called many times", () => {
  const store = initStore()
  const state = store.dispatchAll([
    actions.mainSearchEvents(["item1"]),
    actions.mainSearchEvents(["item2", "item3"])
  ])

  expect(mainSearch.getMainSearchEvents(state)).toEqual([
    "item1",
    "item2",
    "item3"
  ])
})

test("MAIN_SEARCH_COMPLETE sets is fetching to false", () => {
  const store = initStore()
  const state = store.dispatchAll([
    actions.requestMainSearch(),
    actions.completeMainSearch()
  ])

  expect(mainSearch.getMainSearchIsFetching(state)).toBe(false)
})

test("MAIN_SEARCH_EVENTS_SPLICE chomps off the events at an index", () => {
  const store = initStore()
  const state2 = store.dispatchAll([
    actions.mainSearchEvents(["a", "b", "c", "d"]),
    actions.spliceMainSearchEvents(1)
  ])

  expect(mainSearch.getMainSearchEvents(state2)).toEqual(["a"])
})
