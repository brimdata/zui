import Workspaces from "../Workspaces"
import Current from "./"
import Spaces from "../Spaces"
import fixtures from "../../test/fixtures"
import initTestStore from "../../test/initTestStore"
import {Workspace} from "../Workspaces/types"

let store

beforeEach(() => {
  store = initTestStore()
})

test("setting the space id", () => {
  store.dispatch(Current.setSpaceId("1"))

  expect(Current.getSpaceId(store.getState())).toBe("1")
})

test("setting the workspace id", () => {
  store.dispatch(Current.setWorkspaceId("a"))

  expect(Current.getWorkspaceId(store.getState())).toBe("a")
})

test("getting the actual workspace", () => {
  const ws: Workspace = {
    id: "myws",
    name: "myws",
    host: "www.myws.com",
    port: "123",
    authType: "none"
  }
  const state = store.dispatchAll([
    Workspaces.add(ws),
    Current.setWorkspaceId("myws")
  ])

  expect(Current.mustGetWorkspace(state).serialize()).toEqual(ws)
})

test("getting the actual space", () => {
  const space = fixtures("space1")
  const ws: Workspace = {
    id: "myws",
    name: "myws",
    host: "www.myws.com",
    port: "123",
    authType: "none"
  }
  const state = store.dispatchAll([
    Workspaces.add(ws),
    Spaces.setDetail("myws", space),
    Current.setWorkspaceId("myws"),
    Current.setSpaceId(space.id)
  ])

  expect(Current.mustGetSpace(state)).toEqual(expect.objectContaining(space))
})
