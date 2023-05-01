/**
 * @jest-environment jsdom
 */

import dispatchAll from "src/test/unit/helpers/dispatchAll"
import Current from "../Current"
import {Store} from "../types"
import Tabs from "./"
import initTestStore from "src/test/unit/helpers/initTestStore"

let store: Store
beforeEach(async () => {
  store = await initTestStore()
})

test("initial state has one tab", () => {
  expect(Tabs.getCount(store.getState())).toBe(1)
})

test("add tab with no data", () => {
  const state = dispatchAll(store, [Tabs.add("1")])
  expect(Tabs.getCount(state)).toBe(2)
})

test("cannot activate tab that does not exist in data", () => {
  const state = dispatchAll(store, [
    Tabs.add("1"),
    Tabs.activate("1"),
    Tabs.activate("does-not-exist"),
  ])
  const tab = Tabs.getActiveTab(state)
  expect(tab.id).toBe("1")
})

test("remove tab", () => {
  const state = dispatchAll(store, [Tabs.add("1"), Tabs.remove("1")])
  expect(Tabs.getCount(state)).toBe(1)
})

test("remove last, active tab", () => {
  const state = dispatchAll(store, [
    Tabs.add("1"),
    Tabs.add("2"),
    Tabs.activate("2"),
    Tabs.remove("2"),
  ])
  expect(Tabs.getActive(state)).toBe("1")
})

test("remove middle, active tab", () => {
  const state = dispatchAll(store, [
    Tabs.add("1"),
    Tabs.add("2"),
    Tabs.add("3"),
    Tabs.add("4"),
    Tabs.activate("2"),
    Tabs.remove("2"),
  ])
  expect(Tabs.getActive(state)).toBe("3")
})

test("remove first, active tab", () => {
  const first = Tabs.getData(store.getState())[0].id as string
  const state = dispatchAll(store, [
    Tabs.add("1"),
    Tabs.add("2"),
    Tabs.add("3"),
    Tabs.add("3"),
    Tabs.remove(first),
  ])
  expect(Tabs.getActive(state)).toBe("1")
})

test("remove non-active tab before active tab", () => {
  const state = dispatchAll(store, [
    Tabs.add("1"),
    Tabs.add("2"),
    Tabs.activate("2"),
    Tabs.remove("1"),
  ])
  expect(Tabs.getActive(state)).toBe("2")
})

test("remove non-active tab after active tab", () => {
  const state = dispatchAll(store, [
    Tabs.add("1"),
    Tabs.add("2"),
    Tabs.activate("1"),
    Tabs.remove("2"),
  ])
  expect(Tabs.getActive(state)).toBe("1")
})

test("remove tab does nothing if only one tab left", () => {
  const first = Tabs.getData(store.getState())[0].id as string
  const state = dispatchAll(store, [Tabs.remove(first)])

  expect(Tabs.getCount(state)).toBe(1)
})

test("reorder tabs", () => {
  const first = Tabs.getData(store.getState())[0].id

  const state = dispatchAll(store, [
    Tabs.add("a"),
    Tabs.add("b"),
    Tabs.add("c"),
    Tabs.order([3, 1, 2, 0]),
  ])

  expect(Tabs.getData(state).map((t) => t.id)).toEqual(["c", "a", "b", first])
})

test("reorder tabs does not throw error if invalid", () => {
  const first = Tabs.getData(store.getState())[0].id

  const state = dispatchAll(store, [
    Tabs.add("a"),
    Tabs.add("b"),
    Tabs.add("c"),
    Tabs.order([0, 0, 0, 0]),
  ])

  expect(Tabs.getData(state).map((t) => t.id)).toEqual([first])
})

test("reset tab", () => {
  const state = dispatchAll(store, [Tabs.clearActive()])

  const tab = Tabs.getActiveTab(state)
  expect(tab.id).toEqual(Tabs.getActive(state))
  expect(Current.getPoolId(state)).toEqual(null)
})
