import Lakes from "./"
import initTestStore from "../../../../test/unit/helpers/initTestStore"
import {Lake} from "./types"

let store
beforeEach(() => {
  store = initTestStore()
})

const lake: Lake = {
  id: "123",
  name: "123",
  host: "boom.com",
  port: "9867",
  authType: "none"
}

test("addLake", () => {
  const state = store.dispatchAll([Lakes.add(lake)])

  expect(Lakes.id("123")(state).id).toEqual("123")
})

test("addLake when it already exists", () => {
  const state = store.dispatchAll([Lakes.add(lake), Lakes.add(lake)])

  expect(Lakes.all(state).map((l) => l.id)).toEqual([lake.id])
})

test("removeCluster", () => {
  const state = store.dispatchAll([Lakes.add(lake), Lakes.remove("123")])

  expect(Lakes.all(state)).toEqual([])
})
