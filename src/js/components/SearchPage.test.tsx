import React from "react"

import SearchPage from "./SearchPage"
import loginTo from "../test/helpers/loginTo"
import provide from "../test/helpers/provide"
import {TestStore} from "../test/initTestStore"

let store: TestStore
beforeEach(async () => {
  jest.useRealTimers()
  let setup = await loginTo("cluster1", "space1")
  store = setup.store
  jest.useFakeTimers()
})

test("Render the search page", () => {
  provide(store, <SearchPage />)
})
