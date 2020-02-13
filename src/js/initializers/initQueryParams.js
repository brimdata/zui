/* @flow */

import type {Store} from "../state/types"
import Clusters from "../state/Clusters"
import Search from "../state/Search"
import refreshSpaceInfo from "../flows/refreshSpaceInfo"

export default function(store: Store) {
  var urlSearchParams = new URLSearchParams(global.location.search)
  let {space, host, port} = Object.fromEntries(urlSearchParams.entries())
  let cluster = {
    id: "zqd",
    host: host || "localhost",
    port: port || "9867",
    username: "",
    password: ""
  }

  store.dispatch(Clusters.add(cluster))
  store.dispatch(Search.setCluster(cluster.id))
  if (space) {
    store.dispatch(Search.setSpace(space))
    store.dispatch(refreshSpaceInfo())
  }
}
