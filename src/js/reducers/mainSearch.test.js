/* @flow */

import {getLogTuples} from "./logs"
import {receiveLogTuples, setLogsSpliceIndex, spliceLogs} from "../actions/logs"
import ParallelSearch from "../models/ParallelSearch"
import * as actions from "../actions/mainSearch"
import initStore from "../test/initStore"
import * as mainSearch from "./mainSearch"

let store, request
beforeEach(() => {
  store = initStore()
  request = new ParallelSearch(store.dispatch, [])
})

test("MAIN_SEARCH_COMPLETE sets is fetching to false", () => {
  const store = initStore()
  const state = store.dispatchAll([
    actions.requestMainSearch(request),
    actions.completeMainSearch()
  ])

  expect(mainSearch.getMainSearchIsFetching(state)).toBe(false)
})

test("SPLICE_LOGS chomps off the events at an index", () => {
  const store = initStore()
  const state2 = store.dispatchAll([
    receiveLogTuples([["a"], ["b"], ["c"], ["d"]]),
    setLogsSpliceIndex(1),
    spliceLogs()
  ])

  expect(getLogTuples(state2)).toEqual([["a"]])
})

test("#getTds", () => {
  const store = initStore()
  const state = store.dispatchAll([
    receiveLogTuples([
      ["1", "conn"],
      ["1", "conn"],
      ["2", "dns"],
      ["3", "dhcp"]
    ])
  ])

  expect(mainSearch.getTds(state)).toEqual(["1", "2", "3"])
})
