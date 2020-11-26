import Current from "../state/Current"
import Clusters from "../state/Clusters"
import {Cluster} from "../state/Clusters/types"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"
import ConnectionStatuses from "../state/ConnectionStatuses"
import brim from "../brim"

export const initConnection = (cluster: Cluster) => (
  dispatch,
  getState,
  {createZealot}
): Promise<void> => {
  const zealot = createZealot(brim.connection(cluster).getAddress())
  return zealot
    .version()
    .then(({version}) => {
      const connectedCluster: Cluster = {
        ...cluster,
        version
      }
      dispatch(Clusters.add(connectedCluster))
      dispatch(ConnectionStatuses.set(cluster.id, "connected"))
      globalDispatch(Clusters.add(connectedCluster)).then(() => {
        dispatch(Current.setConnectionId(cluster.id))
        dispatch(refreshSpaceNames())
      })
    })
    .catch((e) => {
      dispatch(ConnectionStatuses.set(cluster.id, "disconnected"))
      throw e
    })
}
