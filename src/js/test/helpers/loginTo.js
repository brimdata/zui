/* @flow */

import {initSpace} from "../../flows/space/thunks"
import MockBoomClient from "../MockBoomClient"
import fixtures from "../fixtures"
import initTestStore from "../initTestStore"
import search from "../../state/search"

export default function loginTo(clusterName: string, spaceName: string) {
  let boom = new MockBoomClient()
  let store = initTestStore(boom)
  let cluster = fixtures(clusterName)
  let space = fixtures(spaceName)

  boom
    .stub("spaces.list", [space.name])
    .stub("spaces.get", space)
    .stub("search")

  store.dispatch(search.setCluster(cluster))
  store.dispatch(initSpace(space.name))

  return {store, boom, cluster}
}
