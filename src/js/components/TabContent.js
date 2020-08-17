/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import Current from "../state/Current"
import TabSearch from "./TabSearch"
import TabSearchLoading from "./TabSearchLoading"
import TabWelcome from "./TabWelcome"
import brim from "../brim"
import TabNewConnection from "./TabNewConnection"

export default function TabContent() {
  const space = useSelector(Current.getSpace)
  const cluster = useSelector(Current.getConnection)

  if (!cluster) {
    return <TabNewConnection />
  }

  if (!space) {
    return <TabWelcome />
  }

  if (!brim.space(space).queryable()) {
    return <TabSearchLoading />
  }

  return <TabSearch />
}
