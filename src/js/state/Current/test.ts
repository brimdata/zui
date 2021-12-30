import tabHistory from "app/router/tab-history"
import {lakePath, workspacePath} from "app/router/utils/paths"
import fixtures from "../../../../test/unit/fixtures"
import initTestStore from "../../../../test/unit/helpers/initTestStore"
import Pools from "../Pools"
import Lakes from "../Lakes"
import {Lake} from "../Lakes/types"
import Current from "./"

let store

beforeEach(() => {
  store = initTestStore()
})

test("setting the pool id", () => {
  store.dispatch(tabHistory.push(lakePath("1", "1")))

  expect(Current.getPoolId(store.getState())).toBe("1")
})

test("setting the workspace id", () => {
  store.dispatch(tabHistory.push(workspacePath("a")))

  expect(Current.getWorkspaceId(store.getState())).toBe("a")
})

test("getting the actual workspace", () => {
  const ws: Lake = {
    id: "myws",
    name: "myws",
    host: "www.myws.com",
    port: "123",
    authType: "none"
  }
  const state = store.dispatchAll([Lakes.add(ws)])
  store.dispatch(tabHistory.push(workspacePath(ws.id)))

  expect(Current.mustGetWorkspace(state).serialize()).toEqual(ws)
})

test("getting the actual pool", () => {
  const pool = fixtures("pool1")
  const ws: Lake = {
    id: "myws",
    name: "myws",
    host: "www.myws.com",
    port: "123",
    authType: "none"
  }
  const state = store.dispatchAll([
    Lakes.add(ws),
    Pools.setDetail("myws", pool)
  ])
  store.dispatch(tabHistory.push(lakePath(pool.id, ws.id)))

  expect(Current.mustGetPool(state)).toEqual(expect.objectContaining(pool))
})
