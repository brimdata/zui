/* @flow */
import {Handler} from "../BoomClient"
import {
  cancelBoomSearches,
  clearBoomSearches,
  killBoomSearches,
  registerBoomSearch,
  setBoomSearchStats,
  setBoomSearchStatus
} from "../actions/boomSearches"
import {getBoomSearches} from "./boomSearches"
import initTestStore from "../test/initTestStore"

describe("boomSearches reducer", () => {
  let store

  beforeEach(() => {
    store = initTestStore()
    store.dispatchAll([
      registerBoomSearch("Histogram", {tag: "viewer", handler: new Handler()}),
      registerBoomSearch("Logs", {tag: "detail", handler: new Handler()})
    ])
  })

  const getSearches = () => getBoomSearches(store.getState())

  const getSearch = name => getSearches()[name]

  const getSearchCount = () => Object.keys(getSearches()).length

  test("#registerBoomSearch", () => {
    expect(getSearchCount()).toBe(2)
  })

  test("#registerBoomSearch adds a tag", () => {
    expect(getSearch("Histogram").tag).toBe("viewer")
  })

  test("#setBoomSearchStatus", () => {
    store.dispatch(setBoomSearchStatus("Histogram", "SUCCESS"))

    expect(getSearch("Histogram").status).toBe("SUCCESS")
  })

  test("#setBoomSearchStatus for search that does not exist", () => {
    expect(() => {
      store.dispatch(setBoomSearchStatus("NoSearchHere", "SUCCESS"))
    }).toThrowErrorMatchingSnapshot()
  })

  test("#setBoomSearchStats", () => {
    store.dispatch(setBoomSearchStats("Histogram", {tuples_read: 100}))

    expect(getSearch("Histogram").stats).toEqual({
      tuples_read: 100
    })
  })

  test("#setBoomSearchStats for search that does not exist", () => {
    expect(() => {
      store.dispatch(setBoomSearchStats("NoSearchHere", {tuples_read: 100}))
    }).toThrowErrorMatchingSnapshot()
  })

  test("#boomSearchesClear", () => {
    store.dispatch(clearBoomSearches())

    expect(getSearches()).toEqual({})
  })

  test("#boomSearchesClearWithTag", () => {
    store.dispatch(clearBoomSearches("viewer"))

    expect(getSearchCount()).toEqual(1)
  })

  test("#killBoomSearches", () => {
    const killFunc = jest.fn()
    store.dispatchAll([
      clearBoomSearches(),
      registerBoomSearch("Histogram", {
        handler: new Handler(killFunc),
        tag: "detail"
      }),
      registerBoomSearch("Logs", {
        handler: new Handler(killFunc),
        tag: "detail"
      }),
      killBoomSearches()
    ])

    expect(killFunc).toBeCalledTimes(2)
  })

  test("#killBoomSearches by tag", () => {
    const killFunc = jest.fn()
    store.dispatchAll([
      clearBoomSearches(),
      registerBoomSearch("Histogram", {
        tag: "detail",
        handler: new Handler(killFunc)
      }),
      registerBoomSearch("Logs", {
        tag: "viewer",
        handler: new Handler(killFunc)
      }),
      killBoomSearches("viewer")
    ])

    expect(killFunc).toBeCalledTimes(1)
  })

  test("#killBoomSearches runs abort callback", () => {
    const handler = new Handler(jest.fn())

    const func = jest.spyOn(handler, "abortRequest")

    store.dispatchAll([
      clearBoomSearches(),
      registerBoomSearch("KillMe", {handler, tag: "viewer"}),
      killBoomSearches()
    ])

    expect(func).toBeCalledWith()
  })

  test("#cancelBoomSearches does not run abort callback", () => {
    const handler = new Handler(jest.fn())

    const func = jest.spyOn(handler, "abortRequest")

    store.dispatchAll([
      clearBoomSearches(),
      registerBoomSearch("Cancel Me", {handler, tag: "detail"}),
      cancelBoomSearches()
    ])

    expect(func).toBeCalledWith(false)
  })
})
