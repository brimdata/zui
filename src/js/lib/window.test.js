/* @flow */

import lib from "./"

test("brim window exists", () => {
  let win = lib.window()

  expect(win.exists()).toBe(false)
})

test("brim window does not exists", () => {
  let win = lib.window()
  win.create()
  expect(win.exists()).toBe(true)
})
