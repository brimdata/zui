import {Store} from "../state/types"
import Clusters from "../state/Clusters"
import Current from "../state/Current"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import {Cluster, ClusterStatus} from "../state/Clusters/types"

const setupConnection = (host, port, status: ClusterStatus = "initial") => (
  dispatch,
  _,
  {globalDispatch}
) => {
  const hostPort = [host, port].join(":")
  const cluster: Cluster = {
    host,
    port,
    id: hostPort,
    name: hostPort,
    username: "",
    password: "",
    status
  }
  dispatch(Clusters.add(cluster))
  globalDispatch(Clusters.add(cluster))
  dispatch(Current.setConnectionId(cluster.id))
}

export default function(store: Store) {
  const {host, port, id} = getUrlSearchParams()
  global.windowId = id

  const existingConnection = Current.getConnection(store.getState())

  if (host && port) {
    store.dispatch(setupConnection(host, port, "connected"))
  } else if (!existingConnection) {
    store.dispatch(setupConnection("localhost", "9867"))
  }
}
