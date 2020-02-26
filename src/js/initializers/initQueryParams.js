/* @flow */

import type {Store} from "../state/types"
import {initSpace} from "../flows/initSpace"
import Clusters from "../state/Clusters"
import Search from "../state/Search"

export default function(store: Store) {
  var urlSearchParams = new URLSearchParams(global.location.search)
  let {space, host, port, id} = Object.fromEntries(urlSearchParams.entries())
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
  if (space) store.dispatch(initSpace(space))
}
