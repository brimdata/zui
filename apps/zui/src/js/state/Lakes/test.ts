/**
 * @jest-environment jsdom
 */

import Lakes from "./"
import initTestStore from "src/test/unit/helpers/initTestStore"
import {Lake} from "./types"
import dispatchAll from "src/test/unit/helpers/dispatchAll"

let store
beforeEach(async () => {
  store = await initTestStore()
})

afterEach(async () => {
  await new Promise((r) => setTimeout(r))
})

const lake: Lake = {
  id: "123",
  name: "123",
  host: "boom.com",
  port: "9867",
  authType: "none",
}

test("addLake", () => {
  const state = dispatchAll(store, [Lakes.add(lake)])

  expect(Lakes.id("123")(state).id).toEqual("123")
})

test("addLake when it already exists", () => {
  const state = dispatchAll(store, [Lakes.add(lake), Lakes.add(lake)])

  expect(
    Lakes.all(state)
      .map((l) => l.id)
      .sort()
  ).toEqual([lake.id, "localhost:9867"])
})

test("removeCluster", () => {
  const initial = Lakes.all(store.getState()).length
  dispatchAll(store, [Lakes.add(lake), Lakes.remove("123")])

  expect(Lakes.all(store.getState())).toHaveLength(initial)
})
