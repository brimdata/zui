/* @flow */

import Layout from "./"
import initTestStore from "../../test/initTestStore"

let store, reduce
beforeEach(() => {
  store = initTestStore()
  reduce = store.dispatchAll
})

test("setting right side bar width", () => {
  const state = reduce([Layout.setRightSidebarWidth(299)])

  expect(Layout.getRightSidebarWidth(state)).toBe(299)
})

test("setting left side bar width", () => {
  const state = reduce([Layout.setLeftSidebarWidth(299)])

  expect(Layout.getLeftSidebarWidth(state)).toBe(299)
})
