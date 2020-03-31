/* @flow */
import Search from "../Search"
import initTestStore from "../../test/initTestStore"
import Tabs from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

test("initial state has one tab", () => {
  expect(Tabs.getCount(store.getState())).toBe(1)
})

test("add tab with no data", () => {
  let state = store.dispatchAll([Tabs.add("1")])
  expect(Tabs.getCount(state)).toBe(2)
})

test("add tab with data and activate", () => {
  let state = store.dispatchAll([
    Tabs.add("1", {spanArgs: ["now", "now-1m"]}),
    Tabs.activate("1")
  ])
  let tab = Tabs.getActiveTab(state)
  expect(tab.search.spanArgs).toEqual(["now", "now-1m"])
})

test("cannot activate tab that does not exist in data", () => {
  let state = store.dispatchAll([
    Tabs.add("1"),
    Tabs.activate("1"),
    Tabs.activate("does-not-exist")
  ])
  let tab = Tabs.getActiveTab(state)
  expect(tab.id).toBe("1")
})

test("remove tab", () => {
  let state = store.dispatchAll([Tabs.add("1"), Tabs.remove("1")])
  expect(Tabs.getCount(state)).toBe(1)
})

test("forwards actions to the active tab", () => {
  let state = store.dispatchAll([Search.setSpanArgs(["now-1m", "now"])])
  let tab = Tabs.getActiveTab(state)
  expect(tab.search.spanArgs).toEqual(["now-1m", "now"])
})

test("remove last, active tab", () => {
  let state = store.dispatchAll([
    Tabs.add("1"),
    Tabs.add("2"),
    Tabs.activate("2"),
    Tabs.remove("2")
  ])
  expect(Tabs.getActive(state)).toBe("1")
})

test("remove middle, active tab", () => {
  let state = store.dispatchAll([
    Tabs.add("1"),
    Tabs.add("2"),
    Tabs.add("3"),
    Tabs.add("4"),
    Tabs.activate("2"),
    Tabs.remove("2")
  ])
  expect(Tabs.getActive(state)).toBe("3")
})

test("remove first, active tab", () => {
  let first = Tabs.getData(store.getState())[0].id
  let state = store.dispatchAll([
    Tabs.add("1"),
    Tabs.add("2"),
    Tabs.add("3"),
    Tabs.add("3"),
    Tabs.remove(first)
  ])
  expect(Tabs.getActive(state)).toBe("1")
})

test("remove non-active tab before active tab", () => {
  let state = store.dispatchAll([
    Tabs.add("1"),
    Tabs.add("2"),
    Tabs.activate("2"),
    Tabs.remove("1")
  ])
  expect(Tabs.getActive(state)).toBe("2")
})

test("remove non-active tab after active tab", () => {
  let state = store.dispatchAll([
    Tabs.add("1"),
    Tabs.add("2"),
    Tabs.activate("1"),
    Tabs.remove("2")
  ])
  expect(Tabs.getActive(state)).toBe("1")
})

test("remove tab does nothing if only one tab left", () => {
  let first = Tabs.getData(store.getState())[0].id
  let state = store.dispatchAll([Tabs.remove(first)])

  expect(Tabs.getCount(state)).toBe(1)
})

test("moving a tab to destination index", () => {
  let state = store.dispatchAll([
    Tabs.add("1"),
    Tabs.add("2"),
    Tabs.add("3"),
    Tabs.add("4"),
    Tabs.move("3", 0)
  ])
  let ids = Tabs.getData(state).map((t) => t.id)

  expect(ids.length).toEqual(5)
  expect(ids[0]).toEqual("3")
})

test("reorder tabs", () => {
  let first = Tabs.getData(store.getState())[0].id

  let state = store.dispatchAll([
    Tabs.add("a"),
    Tabs.add("b"),
    Tabs.add("c"),
    Tabs.order([3, 1, 2, 0])
  ])

  expect(Tabs.getData(state).map((t) => t.id)).toEqual(["c", "a", "b", first])
})

test("reorder tabs does not throw error if invalid", () => {
  let first = Tabs.getData(store.getState())[0].id

  let state = store.dispatchAll([
    Tabs.add("a"),
    Tabs.add("b"),
    Tabs.add("c"),
    Tabs.order([0, 0, 0, 0])
  ])

  expect(Tabs.getData(state).map((t) => t.id)).toEqual([first])
})
