import Current from "../state/Current"
import Clusters from "../state/Clusters"
import {Cluster} from "../state/Clusters/types"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"

export const initConnection = (cluster: Cluster) => (
  dispatch,
  getState,
  {createZealot}
): Promise<void> => {
  const zealot = createZealot(cluster.id)
  return zealot
    .status()
    .then(() => {
      const connectedCluster: Cluster = {...cluster, status: "connected"}
      dispatch(Clusters.add(connectedCluster))
      globalDispatch(Clusters.add(connectedCluster)).then(() => {
        dispatch(Current.setConnectionId(cluster.id))
        dispatch(refreshSpaceNames())
      })
    })
    .catch((e) => {
      dispatch(Clusters.setStatus(cluster.id, "disconnected"))
      throw e
    })
}
