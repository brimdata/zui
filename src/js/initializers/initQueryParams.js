/* @flow */

import type {Store} from "../state/types"
import Clusters from "../state/Clusters"
import Search from "../state/Search"

export default function(store: Store) {
  var urlSearchParams = new URLSearchParams(window.location.search)
  let {space, host, port} = Object.fromEntries(urlSearchParams.entries())
  let cluster = {
    id: "zqd",
    space: space || "default",
    host: host || "localhost",
    port: port || "9867",
    username: "",
    password: ""
  }
  store.dispatch(Clusters.add(cluster))
  store.dispatch(Search.setCluster(cluster.id))
  // store.dispatch(Search.setSpace(space))
}
