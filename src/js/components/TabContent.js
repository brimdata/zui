/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import Tab from "../state/Tab"
import TabSearch from "./TabSearch"
import TabSearchLoading from "./TabSearchLoading"
import TabWelcome from "./TabWelcome"
import brim from "../brim"

export default function TabContent() {
  let space = useSelector(Tab.space)

  if (!space) {
    return <TabWelcome />
  }

  if (!brim.space(space).queryable()) {
    return <TabSearchLoading />
  }

  return <TabSearch />
}
