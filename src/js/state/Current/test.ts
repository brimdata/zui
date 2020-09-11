import Clusters from "../Clusters"
import Current from "./"
import Spaces from "../Spaces"
import fixtures from "../../test/fixtures"
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

test("getting the actual connection", () => {
  const conn = {
    id: "myconn",
    host: "www.myconn.com",
    port: "123",
    username: "",
    password: ""
  }
  const state = store.dispatchAll([
    Clusters.add(conn),
    Current.setConnectionId("myconn")
  ])

  expect(Current.mustGetConnection(state)).toEqual(conn)
})

test("getting the actual space", () => {
  const space = fixtures("space1")
  const conn = {
    id: "myconn",
    host: "www.myconn.com",
    port: "123",
    username: "",
    password: ""
  }
  const state = store.dispatchAll([
    Clusters.add(conn),
    Spaces.setDetail("myconn", space),
    Current.setConnectionId("myconn"),
    Current.setSpaceId(space.id)
  ])

  expect(Current.mustGetSpace(state)).toEqual(expect.objectContaining(space))
})
