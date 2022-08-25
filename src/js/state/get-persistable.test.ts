import initTestStore from "src/test/unit/helpers/initTestStore"
import {
  getPersistedGlobalState,
  getPersistedWindowState,
  GLOBAL_PERSIST,
  TAB_PERSIST,
  WINDOW_PERSIST,
} from "./getPersistable"
import Lakes from "./Lakes"
import Tabs from "./Tabs"

test("deleting access tokens for authType auth0", () => {
  const store = initTestStore()
  store.dispatch(
    Lakes.add({
      id: "1",
      authType: "auth0",
      host: "me.com",
      port: "123",
      name: "test",
      authData: {clientId: "1", accessToken: "SECRET", domain: "me.com"},
    })
  )
  const persist = getPersistedWindowState(store.getState())
  const persistedLake = Lakes.id("1")(persist)
  expect(persistedLake.authData).toMatchInlineSnapshot(`
    Object {
      "clientId": "1",
      "domain": "me.com",
    }
  `)
})

test("delete accessToken for authType none", () => {
  const store = initTestStore()
  store.dispatch(
    Lakes.add({
      id: "1",
      authType: "none",
      host: "me.com",
      port: "123",
      name: "test",
    })
  )
  const persist = getPersistedWindowState(store.getState())
  const persistedLake = Lakes.id("1")(persist)
  expect(persistedLake.authData).toMatchInlineSnapshot(`undefined`)
})

test("keeps the tabs", () => {
  const store = initTestStore()
  store.dispatch(Tabs.create("/", "1"))
  store.dispatch(Tabs.create("/", "2"))
  store.dispatch(Tabs.create("/", "3"))
  const persist = getPersistedWindowState(store.getState())
  expect(Object.keys(persist)).toEqual([...WINDOW_PERSIST, "tabs"])
  expect(persist.tabs.data.length).toBe(4)
  expect(Object.keys(persist.tabs.data[0])).toEqual(TAB_PERSIST)
})

test("global persist", () => {
  const store = initTestStore()
  store.dispatch(
    Lakes.add({
      id: "1",
      authType: "auth0",
      host: "me.com",
      port: "123",
      name: "test",
      authData: {clientId: "1", accessToken: "SECRET", domain: "me.com"},
    })
  )
  const persist = getPersistedGlobalState(store.getState())
  const persistedLake = Lakes.id("1")(persist)
  expect(persistedLake.authData).toMatchInlineSnapshot(`
    Object {
      "clientId": "1",
      "domain": "me.com",
    }
  `)
  expect(Object.keys(persist)).toEqual(GLOBAL_PERSIST)
})
