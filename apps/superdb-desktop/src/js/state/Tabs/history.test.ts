/**
 * @jest-environment jsdom
 */

import tabHistory from "src/app/router/tab-history"
import initTestStore from "src/test/unit/helpers/initTestStore"
import Current from "../Current"
import Tabs from "./"
import Histories from "src/modules/histories"

let store
beforeEach(async () => {
  global.tabHistories = new Histories()
  store = await initTestStore()
})

const currentPathnames = () =>
  Current.getHistory(store.getState(), "search").entries.map((e) => e.pathname)

test("creating a tab creates a history entry", () => {
  expect(global.tabHistories.count()).toBe(1)
  store.dispatch(Tabs.create("/url"))
  expect(global.tabHistories.count()).toBe(2)
})

test("activate sets the global.tabHistory", () => {
  expect(global.tabHistories.count()).toBe(1)
  store.dispatch(tabHistory.push("/url-for-tab-1"))
  expect(currentPathnames()).toEqual(["/welcome", "/url-for-tab-1"])

  store.dispatch(Tabs.add("2"))
  expect(currentPathnames()).toEqual(["/welcome", "/url-for-tab-1"])

  store.dispatch(Tabs.activate("2"))
  store.dispatch(tabHistory.push("/url-for-tab-2"))
  expect(currentPathnames()).toEqual(["/", "/url-for-tab-2"])
  expect(global.tabHistories.count()).toBe(2)
})

test("removing the tab does not removes the history too", () => {
  expect(global.tabHistories.count()).toBe(1)
  store.dispatch(tabHistory.push("/url-for-tab-1"))
  store.dispatch(Tabs.add("2"))
  store.dispatch(Tabs.activate("2"))
  store.dispatch(tabHistory.push("/url-for-tab-2"))
  expect(global.tabHistories.count()).toBe(2)

  store.dispatch(Tabs.remove("2"))
  expect(global.tabHistories.count()).toBe(2)
  expect(currentPathnames()).toEqual(["/welcome", "/url-for-tab-1"])
})
