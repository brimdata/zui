/* @flow */

import type {Store} from "../state/types"
import {initSpace} from "../flows/initSpace"
import Clusters from "../state/Clusters"
import Current from "../state/Current"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import refreshSpaceNames from "../flows/refreshSpaceNames"

export default async function(store: Store) {
  let {space, host, port, id} = getUrlSearchParams()
  global.windowId = id

  const clusterHost = host || "localhost"
  const clusterPort = port || "9867"
  const clusterId = `${clusterHost}:${clusterPort}`
  let cluster = {
    id: clusterId,
    host: clusterHost,
    port: clusterPort,
    username: "",
    password: ""
  }

  store.dispatch(Clusters.add(cluster))
  store.dispatch(Current.setConnectionId(cluster.id))
  await store.dispatch(refreshSpaceNames())

  const lastId = Current.getSpaceId(store.getState())
  const spaceId = space || lastId

  if (spaceId) store.dispatch(initSpace(spaceId))
}
