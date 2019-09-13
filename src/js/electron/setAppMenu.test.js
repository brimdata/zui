/* @flow */

import {remote} from "electron"

import {setAppMenu} from "./setAppMenu"

test("setAppMenu to login", () => {
  setAppMenu("login")

  expect(remote.Menu.setApplicationMenu).toHaveBeenCalled()
})

test("setAppMenu to search", () => {
  setAppMenu("search")

  expect(remote.Menu.setApplicationMenu).toHaveBeenCalled()
})

test("setAppMenu to something unknown", () => {
  expect(() => {
    // $FlowFixMe
    setAppMenu("FUNKY")
  }).toThrow("Unknown Menu")
})
