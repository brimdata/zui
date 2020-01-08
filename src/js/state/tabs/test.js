/* @flow */
import initTestStore from "../../test/initTestStore"
import search from "../search"
import tabs from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

test("initial state has one tab", () => {
  expect(tabs.getCount(store.getState())).toBe(1)
})

test("add tab with no data", () => {
  let state = store.dispatchAll([tabs.add("1")])
  expect(tabs.getCount(state)).toBe(2)
})

test("add tab with data and activate", () => {
  let state = store.dispatchAll([
    tabs.add("1", {spanArgs: ["now", "now-1m"]}),
    tabs.activate("1")
  ])
  let tab = tabs.getActiveTab(state)
  expect(tab.search.spanArgs).toEqual(["now", "now-1m"])
})

test("remove tab", () => {
  let state = store.dispatchAll([tabs.add("1"), tabs.remove("1")])
  expect(tabs.getCount(state)).toBe(1)
})

test("forwards actions to the active tab", () => {
  let state = store.dispatchAll([search.setSpanArgs(["now-1m", "now"])])
  let tab = tabs.getActiveTab(state)
  expect(tab.search.spanArgs).toEqual(["now-1m", "now"])
})

test("remove last, active tab", () => {
  let state = store.dispatchAll([
    tabs.add("1"),
    tabs.add("2"),
    tabs.activate("2"),
    tabs.remove("2")
  ])
  expect(tabs.getActive(state)).toBe("1")
})

test("remove middle, active tab", () => {
  let state = store.dispatchAll([
    tabs.add("1"),
    tabs.add("2"),
    tabs.add("3"),
    tabs.add("4"),
    tabs.activate("2"),
    tabs.remove("2")
  ])
  expect(tabs.getActive(state)).toBe("3")
})

test("remove first, active tab", () => {
  let first = tabs.getData(store.getState())[0].id
  let state = store.dispatchAll([
    tabs.add("1"),
    tabs.add("2"),
    tabs.add("3"),
    tabs.add("3"),
    tabs.remove(first)
  ])
  expect(tabs.getActive(state)).toBe("1")
})

test("remove non-active tab before active tab", () => {
  let state = store.dispatchAll([
    tabs.add("1"),
    tabs.add("2"),
    tabs.activate("2"),
    tabs.remove("1")
  ])
  expect(tabs.getActive(state)).toBe("2")
})

test("remove non-active tab after active tab", () => {
  let state = store.dispatchAll([
    tabs.add("1"),
    tabs.add("2"),
    tabs.activate("1"),
    tabs.remove("2")
  ])
  expect(tabs.getActive(state)).toBe("1")
})

test("remove tab does nothing if only one tab left", () => {
  let first = tabs.getData(store.getState())[0].id
  let state = store.dispatchAll([tabs.remove(first)])

  expect(tabs.getCount(state)).toBe(1)
})
