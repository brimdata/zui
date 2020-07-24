/* @flow */

import type {Store} from "../state/types"
import {initSpace} from "../flows/initSpace"
import Clusters from "../state/Clusters"
import Search from "../state/Search"
import getUrlSearchParams from "../lib/getUrlSearchParams"
import refreshSpaceNames from "../flows/refreshSpaceNames"

export default async function(store: Store) {
  let {space, host, port, id} = getUrlSearchParams()
  let cluster = {
    id: "zqd",
    host: host || "localhost",
    port: port || "9867",
    username: "",
    password: ""
  }
  global.windowId = id
  store.dispatch(Clusters.add(cluster))
  store.dispatch(Search.setCluster(cluster.id))
  await store.dispatch(refreshSpaceNames())
  store.dispatch(initSpace(space))
}
