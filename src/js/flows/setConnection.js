/* @flow */
import type {Thunk} from "../state/types"
import Current from "../state/Current"
import Clusters from "../state/Clusters"
import type {Cluster} from "../state/Clusters/types"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"
import Notice from "../state/Notice"

export const setConnection = (cluster: Cluster): Thunk => (
  dispatch,
  getState,
  {createZealot}
) => {
  const newHost = `${cluster.host}:${cluster.port}`
  const zealot = createZealot(newHost)
  return zealot
    .status()
    .then(() => {
      dispatch(Clusters.add(cluster))
      globalDispatch(Clusters.add(cluster)).then(() => {
        dispatch(Current.setConnectionId(cluster.id))
        dispatch(refreshSpaceNames())
      })
    })
    .catch((e) => {
      dispatch(Notice.set(new Error(`Cannot connect to ${newHost}: ${e}`)))
    })
}
