import {Handler} from "../BoomClient"
import {
  clearBoomSearches,
  killBoomSearches,
  registerBoomSearch,
  setBoomSearchStats,
  setBoomSearchStatus
} from "../actions/boomSearches"
import {getBoomSearches} from "./boomSearches"
import initStore from "../test/initStore"

describe("boomSearches reducer", () => {
  let store

  beforeEach(() => {
    store = initStore()
    store.dispatchAll([
      registerBoomSearch("Histogram", new Handler()),
      registerBoomSearch("Logs", new Handler())
    ])
  })

  const getSearches = () => getBoomSearches(store.getState())

  const getSearch = name => getSearches()[name]

  const getSearchCount = () => Object.keys(getSearches()).length

  test("#registerBoomSearch", () => {
    expect(getSearchCount()).toBe(2)
  })

  test("#setBoomSearchStatus", () => {
    store.dispatch(setBoomSearchStatus("Histogram", "SUCCESS"))

    expect(getSearch("Histogram").status).toBe("SUCCESS")
  })

  test("#setBoomSearchStats", () => {
    store.dispatch(setBoomSearchStats("Histogram", {tuples_read: 100}))

    expect(getSearch("Histogram").stats).toEqual({
      tuples_read: 100
    })
  })

  test("#boomSearchesClear", () => {
    store.dispatch(clearBoomSearches())

    expect(getBoomSearches(store.getState())).toEqual({})
  })

  test("#killBoomSearches", () => {
    const killFunc = jest.fn()
    store.dispatchAll([
      clearBoomSearches(),
      registerBoomSearch("Histogram", new Handler(killFunc)),
      registerBoomSearch("Logs", new Handler(killFunc)),
      killBoomSearches()
    ])

    expect(killFunc).toBeCalledTimes(2)
  })
})
