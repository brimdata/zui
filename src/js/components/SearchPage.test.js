/* @flow */
import React from "react"

import SearchPage from "./SearchPage"
import loginTo from "../test/helpers/loginTo"
import provide from "../test/helpers/provide"

let boom, store, cluster
beforeEach(async () => {
  jest.useRealTimers()
  let setup = await loginTo("cluster1", "space1")
  boom = setup.boom
  store = setup.store
  cluster = setup.cluster
  jest.useFakeTimers()
})

test("zq version mismatch", () => {
  boom.stub("serverVersion", {zq: "0.0.0"})

  let el = provide(store, <SearchPage cluster={cluster} />)
  jest.runAllTimers()

  expect(el.text()).toContain("Server and client zq versions do not match")
  expect(el.text()).toContain("0.0.0")
})

test("zq version match", () => {
  boom.stub("serverVersion", boom.clientVersion())

  let el = provide(store, <SearchPage cluster={cluster} />)
  jest.runAllTimers()
  expect(el.text()).not.toContain("Server and client zq versions do not match")
})
