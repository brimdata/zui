/* @flow */

import {
  clearSearches,
  registerSearch,
  setSearchStats,
  setSearchStatus
} from "./actions"
import {getSearch, getSearches} from "./selector"
import Handler from "../../BoomClient/lib/Handler"
import initTestStore from "../../test/initTestStore"

describe("searches reducer", () => {
  let store

  beforeEach(() => {
    store = initTestStore()
    store.dispatchAll([
      registerSearch("Histogram", {tag: "viewer", handler: new Handler()}),
      registerSearch("Logs", {tag: "detail", handler: new Handler()})
    ])
  })

  test("#registerSearch", () => {
    let searches = getSearches(store.getState())

    expect(Object.keys(searches)).toHaveLength(2)
  })

  test("#registerSearch adds a tag", () => {
    let search = getSearch(store.getState(), "Histogram")

    expect(search.tag).toBe("viewer")
  })

  test("#setSearchStatus", () => {
    store.dispatch(setSearchStatus("Histogram", "SUCCESS"))
    let search = getSearch(store.getState(), "Histogram")

    expect(search.status).toBe("SUCCESS")
  })

  test("#setSearchStatus for search that does not exist", () => {
    expect(() => {
      store.dispatch(setSearchStatus("NoSearchHere", "SUCCESS"))
    }).toThrowErrorMatchingSnapshot()
  })

  test("#setSearchStats", () => {
    let stats = {
      tuplesRead: 100,
      tuplesMatched: 100,
      bytesMatched: 100,
      bytesRead: 2300,
      startTime: 1,
      updateTime: 3
    }

    store.dispatch(setSearchStats("Histogram", stats))
    let search = getSearch(store.getState(), "Histogram")

    expect(search.stats).toEqual(stats)
  })

  test("#setSearchStats for search that does not exist", () => {
    expect(() => {
      store.dispatch(
        setSearchStats("NoSearchHere", {
          tuplesRead: 100,
          tuplesMatched: 100,
          bytesMatched: 100,
          bytesRead: 2300,
          startTime: 1,
          updateTime: 3
        })
      )
    }).toThrowErrorMatchingSnapshot()
  })

  test("searches clear", () => {
    store.dispatch(clearSearches())

    expect(getSearches(store.getState())).toEqual({})
  })

  test("searches clear with tag", () => {
    store.dispatch(clearSearches("viewer"))
    let searches = getSearches(store.getState())

    expect(Object.keys(searches)).toHaveLength(1)
  })
})
