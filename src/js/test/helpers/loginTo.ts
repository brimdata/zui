import {createZealotMock} from "zealot"

import {initSpace} from "../../flows/initSpace"
import Clusters from "../../state/Clusters"
import Current from "../../state/Current"
import Spaces from "../../state/Spaces"
import fixtures from "../fixtures"
import initTestStore, {TestStore} from "../initTestStore"
import {Cluster} from "src/js/state/Clusters/types"

export default async function loginTo(
  clusterName: string,
  spaceName: string
): Promise<{store: TestStore; cluster: Cluster}> {
  const zealot = createZealotMock()
  zealot.stubPromise("spaces.list", [{name: "dataSpace", id: "1"}])
  zealot.stubPromise("spaces.get", {name: "dataSpace", id: "1"})
  zealot.stubStream("search", [{type: "TaskStart"}, {type: "TaskEnd"}])
  const store = initTestStore(zealot)
  const cluster = fixtures(clusterName)
  const space = fixtures(spaceName)

  store.dispatch(Clusters.add(cluster))
  store.dispatch(Current.setConnectionId(cluster.id))
  store.dispatch(Spaces.setDetail(cluster.id, space))
  return store.dispatch(initSpace(space.name)).then(() => {
    return {store, cluster}
  })
}
