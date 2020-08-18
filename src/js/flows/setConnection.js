/* @flow */
import type {Thunk} from "../state/types"
import Search from "../state/Search"
import Clusters from "../state/Clusters"
import type {Cluster} from "../state/Clusters/types"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"

export const setConnection = (cluster: Cluster): Thunk => (
  dispatch,
  getState,
  {zealot}
) => {
  zealot.setHost(`${cluster.host}:${cluster.port}`)
  globalDispatch(Clusters.add(cluster)).then(() => {
    dispatch(Search.setCluster(cluster.id))
    dispatch(refreshSpaceNames())
  })
}
