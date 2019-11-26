/* @flow */
import React from "react"

import SearchPage from "./SearchPage"
import loginTo from "../test/helpers/loginTo"
import provide from "../test/helpers/provide"

jest.useFakeTimers()

test("zq version mismatch", () => {
  let {boom, store, cluster} = loginTo("cluster1", "space1")
  boom.stub("serverVersion", {zq: "0.0.0"})

  let el = provide(store, <SearchPage cluster={cluster} />)
  jest.runAllTimers()

  expect(el.text()).toContain("Server and client zq versions do not match")
  expect(el.text()).toContain("0.0.0")
})

test("zq version match", () => {
  let {boom, store, cluster} = loginTo("cluster1", "space1")

  boom.stub("serverVersion", boom.clientVersion())

  let el = provide(store, <SearchPage cluster={cluster} />)
  jest.runAllTimers()

  expect(el.text()).not.toContain("Server and client zq versions do not match")
})
