/* @flow */
import React from "react"

import {XRightPane} from "./RightPane"
import Layout from "../state/Layout"
import LogDetails from "../state/LogDetails"
import Search from "../state/Search"
import loginTo from "../test/helpers/loginTo"
import provide from "../test/helpers/provide"

test("no errors if space does not exist", async () => {
  let {store} = await loginTo("cluster1", "space1")

  store.dispatch(Layout.showRightSidebar())
  store.dispatch(Search.setSpace("", ""))
  store.dispatch(LogDetails.push([]))
  let el = provide(store, <XRightPane />)
  expect(el.html()).toBe("")
})
