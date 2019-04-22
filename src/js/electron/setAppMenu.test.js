/* @flow */

import {remote} from "electron"

import {setAppMenu} from "./setAppMenu"

test("setAppMenu to login", () => {
  setAppMenu("LOGIN")

  expect(remote.Menu.setApplicationMenu).toHaveBeenCalled()
})

test("setAppMenu to search", () => {
  setAppMenu("SEARCH")

  expect(remote.Menu.setApplicationMenu).toHaveBeenCalled()
})

test("setAppMenu to something unknown", () => {
  expect(() => {
    // $FlowFixMe
    setAppMenu("FUNKY")
  }).toThrow("Unknown Menu")
})
