/* @flow */
import React from "react"

import SearchPage from "./SearchPage"
import loginTo from "../test/helpers/loginTo"
import provide from "../test/helpers/provide"
import theme from "../style-theme"
import {ThemeProvider} from "styled-components"

let store, cluster
beforeEach(async () => {
  jest.useRealTimers()
  let setup = await loginTo("cluster1", "space1")
  store = setup.store
  cluster = setup.cluster
  jest.useFakeTimers()
})

test("Render the search page", () => {
  provide(
    store,
    <ThemeProvider theme={theme}>
      <SearchPage cluster={cluster} />
    </ThemeProvider>
  )
})
