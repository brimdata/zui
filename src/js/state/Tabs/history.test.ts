import initTestStore from "src/js/test/initTestStore"
import Tabs from "./"

let store
beforeEach(() => {
  store = initTestStore()
})

const currentPathnames = () => global.tabHistory.entries.map((e) => e.pathname)

test("adding a tab creates a history entry", () => {
  expect(global.tabHistories.count()).toBe(1)
  store.dispatch(Tabs.add("2"))
  expect(global.tabHistories.count()).toBe(2)
})

test("activate sets the global.tabHistory", () => {
  expect(global.tabHistories.count()).toBe(1)
  global.tabHistory.push("/url-for-tab-1")
  expect(currentPathnames()).toEqual(["/", "/url-for-tab-1"])

  store.dispatch(Tabs.add("2"))
  expect(currentPathnames()).toEqual(["/", "/url-for-tab-1"])

  store.dispatch(Tabs.activate("2"))
  global.tabHistory.push("/url-for-tab-2")
  expect(currentPathnames()).toEqual(["/", "/url-for-tab-2"])
  expect(global.tabHistories.count()).toBe(2)
})

test("removing a tab removes the history too", () => {
  global.tabHistory.push("/url-for-tab-1")
  store.dispatch(Tabs.add("2"))
  store.dispatch(Tabs.activate("2"))
  store.dispatch(Tabs.remove("2"))

  expect(global.tabHistories.count()).toBe(1)
  expect(currentPathnames()).toEqual(["/", "/url-for-tab-1"])
})
