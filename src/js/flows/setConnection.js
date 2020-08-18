/* @flow */
import type {Thunk} from "../state/types"
import Current from "../state/Current"
import Clusters from "../state/Clusters"
import type {Cluster} from "../state/Clusters/types"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"
import Notice from "../state/Notice"

export const setConnection = (cluster: Cluster): Thunk => async (
  dispatch,
  getState,
  {zealot}
) => {
  const currentHost = zealot.getHost()
  const newHost = `${cluster.host}:${cluster.port}`
  zealot.setHost(newHost)
  return zealot
    .status()
    .then(() => {
      globalDispatch(Clusters.add(cluster)).then(() => {
        dispatch(Current.setConnectionId(cluster.id))
        dispatch(refreshSpaceNames())
      })
    })
    .catch((e) => {
      zealot.setHost(currentHost)
      dispatch(Current.setConnectionId(currentHost))
      dispatch(Notice.set(new Error(`Cannot connect to ${newHost}: ${e}`)))
    })
}
