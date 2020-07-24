/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {initSpace} from "../flows/initSpace"
import Tab from "../state/Tab"
import TabArchiveSearch from "./TabArchiveSearch"
import TabSearch from "./TabSearch"
import TabSearchLoading from "./TabSearchLoading"
import TabWelcome from "./TabWelcome"
import brim from "../brim"

export default function TabContent() {
  const dispatch = useDispatch()
  const space = useSelector(Tab.space)

  useEffect(() => {
    if (space) dispatch(initSpace(space.id))
  }, [])

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
