import React from "react"

import {XRightPane} from "./RightPane"
import Current from "../state/Current"
import Layout from "../state/Layout"
import LogDetails from "../state/LogDetails"
import loginTo from "../test/helpers/loginTo"
import provide from "../test/helpers/provide"
import {zng} from "zealot"

test("no errors if space does not exist", async () => {
  const {store} = await loginTo("cluster1", "space1")

  store.dispatch(Layout.showRightSidebar())
  store.dispatch(Current.setSpaceId(null))
  store.dispatch(LogDetails.push(new zng.Record([], [])))
  const el = provide(store, <XRightPane />)
  expect(el.html()).toBe("")
})
