import * as view from "./view"
import * as a from "../actions/view"
import initStore from "../test/initStore"

const reduce = actionList => ({
  view: actionList.reduce(view.default, view.initialState)
})

test("sets the timezone", () => {
  const actions = [a.setTimeZone("America/Los_Angeles")]
  const state = reduce(actions)
  expect(view.getTimeZone(state)).toBe("America/Los_Angeles")
})

test("timeZone defaults to UTC", () => {
  const state = reduce([{}])
  expect(view.getTimeZone(state)).toBe("UTC")
})

test("setting right side bar width", () => {
  const state = reduce([a.setRightSidebarWidth(299)])

  expect(view.getRightSidebarWidth(state)).toBe(299)
})

test("setting left side bar width", () => {
  const state = reduce([a.setLeftSidebarWidth(1299)])

  expect(view.getLeftSidebarWidth(state)).toBe(1299)
})

test("showing the downloads bar", () => {
  const state = reduce([a.showDownloads()])

  expect(view.getDownloadsIsOpen(state)).toBe(true)
})

test("hiding the downloads bar", () => {
  const state = reduce([a.showDownloads(), a.hideDownloads()])

  expect(view.getDownloadsIsOpen(state)).toBe(false)
})

test("set the active modal", () => {
  const store = initStore()
  const state = store.dispatchAll([a.showModal("debug")])

  expect(view.getDebugModalIsOpen(state)).toBe(true)
})

test("hide a modal", () => {
  const store = initStore()
  const state = store.dispatchAll([a.showModal("debug"), a.hideModal()])

  expect(view.getModal(state)).toBe(null)
})

test("show the search inspector", () => {
  const store = initStore()

  expect(view.getSearchInspectorIsOpen(store.getState())).toBe(false)

  const state = store.dispatchAll([a.showSearchInspector()])

  expect(view.getSearchInspectorIsOpen(state)).toBe(true)
})

test("hide the search inspector", () => {
  const store = initStore()
  const state = store.dispatchAll([
    a.showSearchInspector(),
    a.hideSearchInspector()
  ])

  expect(view.getSearchInspectorIsOpen(state)).toBe(false)
})
