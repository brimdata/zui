/* @flow */

import {getType} from "./SearchFactory"
import initStore from "../test/initStore"
import * as searchBar from "../actions/searchBar"

let store
beforeEach(() => {
  store = initStore()
})

test("#getType when LOGS_PAGED", () => {
  expect(getType(store.getState())).toBe("LOGS_PAGED")
})

test("#getType when LOGS_HEAD", () => {
  store.dispatch(searchBar.changeSearchBarInput("* | head 1"))

  expect(getType(store.getState())).toBe("LOGS_HEAD")
})
