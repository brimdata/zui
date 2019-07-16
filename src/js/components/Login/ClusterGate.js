/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import {getCurrentCluster} from "../../state/clusters/selectors"
import ClustersPage from "./ClustersPage"
import SearchPage from "../SearchPage"

export default function ClusterGate() {
  let cluster = useSelector(getCurrentCluster)

  if (cluster === null) {
    return <ClustersPage />
  } else {
    return <SearchPage cluster={cluster} />
  }
}
