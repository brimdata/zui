/* @flow */

import lib from "./"
import windowState from "../electron/windowState"

test("brim window exists", () => {
  let win = lib.window(windowState())

  expect(win.exists()).toBe(false)
})

test("brim window does not exists", () => {
  let win = lib.window(windowState())
  win.create()
  expect(win.exists()).toBe(true)
})
