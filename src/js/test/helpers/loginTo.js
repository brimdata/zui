/* @flow */

import {initSpace} from "../../flows/initSpace"
import Clusters from "../../state/Clusters"
import MockBoomClient from "../MockBoomClient"
import Search from "../../state/search"
import fixtures from "../fixtures"
import initTestStore from "../initTestStore"

export default async function loginTo(clusterName: string, spaceName: string) {
  let boom = new MockBoomClient()
  let store = initTestStore(boom)
  let cluster = fixtures(clusterName)
  let space = fixtures(spaceName)

  boom
    .stub("spaces.list", [space.name])
    .stub("spaces.get", space)
    .stub("search")

  store.dispatch(Clusters.add(cluster))
  store.dispatch(Search.setCluster(cluster.id))
  return store.dispatch(initSpace(space.name)).then(() => {
    return {store, boom, cluster}
  })
}
