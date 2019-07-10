/* @flow */
import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {chooseSpace} from "../../space/choose"
import {getCurrentCluster} from "../../state/clusters/selectors"
import {getCurrentSpaceName} from "../../state/reducers/spaces"
import {setAppMenu} from "../../electron/setAppMenu"
import {setSpaceNames} from "../../state/actions"
import {switchSpace} from "../../space/switch"
import {testConnection} from "../../backend/testConnection"
import ClustersPage from "./ClustersPage"
import SearchPageGate from "../SearchPageGate"

export default function ClusterGate() {
  let cluster = useSelector(getCurrentCluster)
  let dispatch = useDispatch()
  let lastSpaceName = useSelector(getCurrentSpaceName)

  useEffect(() => {
    if (cluster) {
      dispatch(testConnection(cluster))
        .then((names) => {
          dispatch(setSpaceNames(names))
          return dispatch(switchSpace(chooseSpace(names, lastSpaceName)))
        })
        .then(() => {
          setAppMenu("SEARCH")
        })
    }
  }, [])

  if (cluster === null) {
    return <ClustersPage />
  } else {
    return <SearchPageGate cluster={cluster} />
  }
}
