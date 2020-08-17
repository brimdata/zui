/* @flow */

import {createZealotMock} from "zealot"

import {initSpace} from "../../flows/initSpace"
import Clusters from "../../state/Clusters"
import Current from "../../state/Current"
import Spaces from "../../state/Spaces"
import fixtures from "../fixtures"
import initTestStore from "../initTestStore"

export default async function loginTo(clusterName: string, spaceName: string) {
  let zealot = createZealotMock()
  zealot.stubPromise("spaces.list", [{name: "dataSpace", id: "1"}])
  zealot.stubPromise("spaces.get", {name: "dataSpace", id: "1"})
  zealot.stubStream("search", [{type: "TaskStart"}, {type: "TaskEnd"}])
  let store = initTestStore(zealot)
  let cluster = fixtures(clusterName)
  let space = fixtures(spaceName)

  store.dispatch(Clusters.add(cluster))
  store.dispatch(Current.setConnectionId(cluster.id))
  store.dispatch(Spaces.setDetail(cluster.id, space))
  return store.dispatch(initSpace(space.name)).then(() => {
    return {store, cluster}
  })
}
