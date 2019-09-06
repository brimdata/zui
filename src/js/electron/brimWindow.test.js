/* @flow */
import brimWindow from "./brimWindow"

test("brim window exists", () => {
  let win = brimWindow()

  expect(win.exists()).toBe(false)
})

test("brim window does not exists", () => {
  let win = brimWindow()
  win.create()
  expect(win.exists()).toBe(true)
})
