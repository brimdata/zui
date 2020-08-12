/* @flow */
import Current from "./"
import initTestStore from "../../test/initTestStore"

let store

beforeEach(() => {
  store = initTestStore()
})

test("setting the space id", () => {
  store.dispatch(Current.setSpaceId("1"))

  expect(Current.getSpaceId(store.getState())).toBe("1")
})

test("setting the connection id", () => {
  store.dispatch(Current.setConnectionId("a"))

  expect(Current.getConnectionId(store.getState())).toBe("a")
})
