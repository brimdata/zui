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

test("Render the search page", () => {
  provide(store, <SearchPage cluster={cluster} />)
})
