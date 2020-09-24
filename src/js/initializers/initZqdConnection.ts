import {Store} from "../state/types"
import {initSpace} from "../flows/initSpace"
import Clusters from "../state/Clusters"
import Current from "../state/Current"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import refreshSpacesForAllConnections from "../flows/refreshSpacesForAllConnections"
import {globalDispatch} from "../state/GlobalContext"

export default async function(store: Store) {
  const {space, host, port, id} = getUrlSearchParams()
  global.windowId = id

  const lastConn = Current.getConnection(store.getState())
  if ((port && host) || !lastConn) {
    const clusterHost = host || "localhost"
    const clusterPort = port || "9867"
    const clusterId = `${clusterHost}:${clusterPort}`
    const cluster = {
      id: clusterId,
      host: clusterHost,
      port: clusterPort,
      username: "",
      password: ""
    }

    store.dispatch(Clusters.add(cluster))
    globalDispatch(Clusters.add(cluster))
    store.dispatch(Current.setConnectionId(cluster.id))
  }

  await store.dispatch(refreshSpacesForAllConnections())

  const lastId = Current.getSpaceId(store.getState())
  const spaceId = space || lastId

  if (spaceId) store.dispatch(initSpace(spaceId))
}
