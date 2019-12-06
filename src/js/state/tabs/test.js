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
  let state = store.dispatchAll([tabs.add()])
  expect(tabs.getCount(state)).toBe(2)
})

test("add tab with data and activate", () => {
  let state = store.dispatchAll([
    tabs.add({spanArgs: ["now", "now-1m"]}),
    tabs.activate(1)
  ])
  let tab = tabs.getActiveTab(state)
  expect(tab.spanArgs).toEqual(["now", "now-1m"])
})

test("remove tab", () => {
  let state = store.dispatchAll([tabs.add(), tabs.remove(1)])
  expect(tabs.getCount(state)).toBe(1)
})

test("setSearchSpan", () => {
  let state = store.dispatchAll([search.setSpanArgs(["now-1m", "now"])])
  let tab = tabs.getActiveTab(state)
  expect(tab.spanArgs).toEqual(["now-1m", "now"])
})

test("remove last, active tab", () => {
  let state = store.dispatchAll([
    tabs.add(),
    tabs.add(),
    tabs.activate(2),
    tabs.remove(2)
  ])
  expect(tabs.getActive(state)).toBe(1)
})

test("remove middle, active tab", () => {
  let state = store.dispatchAll([
    tabs.add(),
    tabs.add(),
    tabs.add(),
    tabs.add(),
    tabs.activate(2),
    tabs.remove(2)
  ])
  expect(tabs.getActive(state)).toBe(2)
})

test("remove first, active tab", () => {
  let state = store.dispatchAll([
    tabs.add(),
    tabs.add(),
    tabs.add(),
    tabs.add(),
    tabs.remove(0)
  ])
  expect(tabs.getActive(state)).toBe(0)
})

test("remove non-active tab before active tab", () => {
  let state = store.dispatchAll([
    tabs.add(),
    tabs.add(),
    tabs.activate(2),
    tabs.remove(1)
  ])
  expect(tabs.getActive(state)).toBe(1)
})

test("remove non-active tab after active tab", () => {
  let state = store.dispatchAll([
    tabs.add(),
    tabs.add(),
    tabs.activate(1),
    tabs.remove(2)
  ])
  expect(tabs.getActive(state)).toBe(1)
})

test("remove tab does nothing if only one tab left", () => {
  let state = store.dispatchAll([tabs.remove(0)])

  expect(tabs.getCount(state)).toBe(1)
})

test("getAll returns an array", () => {
  let state = store.dispatchAll([tabs.add(), tabs.add()])
  expect(tabs.getAll(state)).toBeInstanceOf(Array)
})
