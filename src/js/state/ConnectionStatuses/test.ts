import initTestStore from "../../test/initTestStore"
import ConnectionStatuses from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

test("set/remove connection status", () => {
  expect(ConnectionStatuses.get("123")(store.getState())).toBeUndefined()

  let state = store.dispatchAll([ConnectionStatuses.set("123", "connected")])

  expect(ConnectionStatuses.get("123")(state)).toBe("connected")

  state = store.dispatchAll([ConnectionStatuses.remove("123")])
  expect(ConnectionStatuses.get("123")(state)).toBeUndefined()
})
