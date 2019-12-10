/* @flow */

import {initSpace} from "../../flows/space/thunks"
import {setCluster} from "../../state/clusters/actions"
import MockBoomClient from "../MockBoomClient"
import fixtures from "../fixtures"
import initTestStore from "../initTestStore"

export default function loginTo(clusterName: string, spaceName: string) {
  let boom = new MockBoomClient()
  let store = initTestStore(boom)
  let cluster = fixtures(clusterName)
  let space = fixtures(spaceName)

  boom
    .stub("spaces.list", [space.name])
    .stub("spaces.get", space)
    .stub("search")

  store.dispatch(setCluster(cluster))
  store.dispatch(initSpace(space.name))

  return {store, boom, cluster}
}
