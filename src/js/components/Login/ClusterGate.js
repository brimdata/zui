/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import {getCurrentCluster} from "../../state/clusters/selectors"
import LoginPage from "./LoginPage"
import SearchPage from "../SearchPage"

export default function ClusterGate() {
  let cluster = useSelector(getCurrentCluster)

  if (cluster === null) {
    return <LoginPage />
  } else {
    return <SearchPage />
  }
}
