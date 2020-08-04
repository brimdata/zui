/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import Tab from "../state/Tab"
import TabArchiveSearch from "./TabArchiveSearch"
import TabSearch from "./TabSearch"
import TabSearchLoading from "./TabSearchLoading"
import TabWelcome from "./TabWelcome"
import brim from "../brim"

export default function TabContent() {
  const space = useSelector(Tab.space)

  if (!space) {
    return <TabWelcome />
  }

  if (!brim.space(space).queryable()) {
    return <TabSearchLoading />
  }

  if (space.storage_kind === "archivestore") {
    return <TabArchiveSearch />
  }
  return <TabSearch />
}
