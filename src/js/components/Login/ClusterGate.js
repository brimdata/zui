/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import LoginPage from "./LoginPage"
import SearchPage from "../SearchPage"
import Tab from "../../state/Tab"

export default function ClusterGate() {
  let cluster = useSelector(Tab.cluster)

  if (!cluster) {
    return <LoginPage />
  } else {
    return <SearchPage />
  }
}
