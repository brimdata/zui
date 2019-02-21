import {getCredentials, getUseBoomCache, getUseBoomIndex} from "./boomd"
import {setBoomdCredentials, useBoomCache, useBoomIndex} from "../actions/boomd"
import initStore from "../test/initStore"

test("setting the credentials", () => {
  const store = initStore()

  store.dispatch(
    setBoomdCredentials({
      user: "james",
      pass: "word",
      host: "localhost",
      port: "9867"
    })
  )

  expect(getCredentials(store.getState())).toEqual({
    user: "james",
    pass: "word",
    host: "localhost",
    port: "9867"
  })
})

test("setting use analytics cache", () => {
  const store = initStore()

  store.dispatch(useBoomCache(true))

  expect(getUseBoomCache(store.getState())).toEqual(true)

  store.dispatch(useBoomCache(false))

  expect(getUseBoomCache(store.getState())).toEqual(false)
})

test("setting use analytics cache", () => {
  const store = initStore()

  store.dispatch(useBoomIndex(true))

  expect(getUseBoomIndex(store.getState())).toEqual(true)

  store.dispatch(useBoomIndex(false))

  expect(getUseBoomIndex(store.getState())).toEqual(false)
})
