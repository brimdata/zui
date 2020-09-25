import {Store} from "../state/types"
import {initSpace} from "../flows/initSpace"
import Clusters from "../state/Clusters"
import Current from "../state/Current"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import refreshSpacesForAllConnections from "../flows/refreshSpacesForAllConnections"

const setupConnection = (host, port) => (dispatch, _, {globalDispatch}) => {
  const cluster = {
    host,
    port,
    id: [host, port].join(":"),
    username: "",
    password: ""
  }
  dispatch(Clusters.add(cluster))
  globalDispatch(Clusters.add(cluster))
  dispatch(Current.setConnectionId(cluster.id))
}

export default async function(store: Store) {
  const {space, host, port, id} = getUrlSearchParams()
  global.windowId = id

  const existingConnection = Current.getConnection(store.getState())

  if (host && port) {
    store.dispatch(setupConnection(host, port))
  } else if (!existingConnection) {
    store.dispatch(setupConnection("localhost", "9867"))
  }

  await store.dispatch(refreshSpacesForAllConnections())

  const spaceId = space || Current.getSpaceId(store.getState())

  if (spaceId) store.dispatch(initSpace(spaceId))
}
