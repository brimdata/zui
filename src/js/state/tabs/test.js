/* @flow */
import initTestStore from "../../test/initTestStore"
import search from "../search"
import tabs from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

test("initial state has one tab", () => {
  let allTabs = tabs.getAll(store.getState())
  expect(allTabs.length).toBe(1)
})

test("add tab with no data", () => {
  let state = store.dispatchAll([tabs.add()])
  expect(tabs.getAll(state).length).toBe(2)
})

test("add tab with data and activate", () => {
  let state = store.dispatchAll([
    tabs.add({spanArgs: ["now", "now-1m"]}),
    tabs.activate("1")
  ])
  let tab = tabs.getActiveTab(state)
  expect(tab.spanArgs).toEqual(["now", "now-1m"])
})

test("remove tab", () => {
  let state = store.dispatchAll([tabs.add(), tabs.remove("1")])
  expect(tabs.getAll(state).length).toBe(1)
})

test("setSearchSpan", () => {
  let state = store.dispatchAll([search.setSpanArgs(["now-1m", "now"])])
  let tab = tabs.getActiveTab(state)
  expect(tab.spanArgs).toEqual(["now-1m", "now"])
})
