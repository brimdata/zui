import tabHistory from "src/app/router/tab-history"
import initTestStore from "src/test/unit/helpers/initTestStore"
import Lakes from "../Lakes"
import {Lake} from "../Lakes/types"
import Current from "./"
import {lakePath, poolSearchPath} from "src/app/router/utils/paths"

let store

beforeEach(() => {
  store = initTestStore()
})

test("setting the pool id", () => {
  store.dispatch(tabHistory.push(poolSearchPath("1", "1")))

  expect(Current.getPoolId(store.getState())).toBe("1")
})

test("setting the lake id", () => {
  store.dispatch(tabHistory.push(lakePath("a")))

  expect(Current.getLakeId(store.getState())).toBe("a")
})

test("getting the actual lake", () => {
  const l: Lake = {
    id: "myws",
    name: "myws",
    host: "www.myws.com",
    port: "123",
    authType: "none"
  }
  const state = store.dispatchAll([Lakes.add(l)])
  store.dispatch(tabHistory.push(lakePath(l.id)))

  expect(Current.mustGetLake(state).serialize()).toEqual(l)
})
