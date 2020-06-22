/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import Tab from "../state/Tab"
import TabSearch from "./TabSearch"
import TabSearchLoading from "./TabSearchLoading"
import TabSignIn from "./TabSignIn"
import TabWelcome from "./TabWelcome"
import brim from "../brim"

export default function TabContent() {
  let cluster = useSelector(Tab.cluster)
  let space = useSelector(Tab.space)

  if (!cluster) {
    return <TabSignIn />
  }

  if (!space) {
    return <TabWelcome />
  }

  if (!brim.space(space).queryable()) {
    return <TabSearchLoading />
  }

  return <TabSearch />
}
