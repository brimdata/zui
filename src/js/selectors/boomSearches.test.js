import {Handler} from "../BoomClient"
import {getSomeAreFetching} from "./boomSearches"
import {registerBoomSearch, setBoomSearchStatus} from "../actions/boomSearches"
import initStore from "../test/initStore"

test("#getSomeAreFetching true", () => {
  let store
  store = initStore()

  store.dispatchAll([
    registerBoomSearch("A", new Handler()),
    registerBoomSearch("B", new Handler())
  ])

  const state = store.getState()

  expect(getSomeAreFetching(state)).toBe(true)
})

test("#getSomeAreFetching false", () => {
  let store
  store = initStore()

  store.dispatchAll([
    registerBoomSearch("A", new Handler()),
    registerBoomSearch("B", new Handler()),
    setBoomSearchStatus("A", "SUCCESS"),
    setBoomSearchStatus("B", "ERROR")
  ])

  const state = store.getState()

  expect(getSomeAreFetching(state)).toBe(false)
})
