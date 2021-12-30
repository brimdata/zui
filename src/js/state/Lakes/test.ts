import Lakes from "./"
import initTestStore from "../../../../test/unit/helpers/initTestStore"
import {Lake} from "./types"

let store
beforeEach(() => {
  store = initTestStore()
})

const workspace: Lake = {
  id: "123",
  name: "123",
  host: "boom.com",
  port: "9867",
  authType: "none"
}

test("addWorkspace", () => {
  const state = store.dispatchAll([Lakes.add(workspace)])

  expect(Lakes.id("123")(state)).toEqual(workspace)
})

test("addWorkspace when it already exists", () => {
  const state = store.dispatchAll([Lakes.add(workspace), Lakes.add(workspace)])

  expect(Lakes.all(state)).toEqual([workspace])
})

test("removeCluster", () => {
  const state = store.dispatchAll([Lakes.add(workspace), Lakes.remove("123")])

  expect(Lakes.all(state)).toEqual([])
})
