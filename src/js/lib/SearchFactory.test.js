/* @flow */

import * as SearchFactory from "./SearchFactory"
import * as searchBar from "../actions/searchBar"
import initStore from "../test/initStore"

let store
beforeEach(() => {
  store = initStore()
})

test("#logsArgs", () => {
  const args = SearchFactory.logsPagedArgs(jest.fn(), store.getState())

  expect(args.program).toBe("* | head 200; every 5min count() by _path")
})

test("#logsSubsetArgs", () => {
  const args = SearchFactory.logsSubsetArgs(jest.fn(), store.getState())

  expect(args.program).toBe("* | head 200; count()")
})

test("#analyticsArgs", () => {
  const args = SearchFactory.analyticsArgs(jest.fn(), store.getState())

  expect(args.program).toBe("*")
})

test("#getType when LOGS_PAGED", () => {
  expect(SearchFactory.getType(store.getState())).toBe("LOGS_PAGED")
})

test("#getType when LOGS_HEAD", () => {
  store.dispatch(searchBar.changeSearchBarInput("* | head 1"))

  expect(SearchFactory.getType(store.getState())).toBe("LOGS_HEAD")
})
