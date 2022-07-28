import initTestStore from "src/test/unit/helpers/initTestStore"
import {getPersistedState} from "./getPersistable"
import Lakes from "./Lakes"

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
  const persist = getPersistedState(store.getState())
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
  const persist = getPersistedState(store.getState())
  const persistedLake = Lakes.id("1")(persist)
  expect(persistedLake.authData).toMatchInlineSnapshot(`undefined`)
})
