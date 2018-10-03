import * as view from "./view"
import * as a from "../actions/view"

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
