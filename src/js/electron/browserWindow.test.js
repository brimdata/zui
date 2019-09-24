/* @flow */

import browserWindow from "./browserWindow"
import windowState from "../electron/windowState"

test("brim window exists", () => {
  let win = browserWindow(windowState())

  expect(win.exists()).toBe(false)
})

test("brim window does not exists", () => {
  let win = browserWindow(windowState())
  win.create()
  expect(win.exists()).toBe(true)
})
