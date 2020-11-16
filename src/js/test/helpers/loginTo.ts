import {createZealotMock, ZealotMock} from "zealot"

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
): Promise<{store: TestStore; cluster: Cluster; zealot: ZealotMock}> {
  const mock = createZealotMock()
  mock
    .stubPromise("version", {version: "1"}, "always")
    .stubPromise("spaces.list", [{name: "dataSpace", id: "1"}], "always")
    .stubPromise("spaces.get", {name: "dataSpace", id: "1"}, "always")
    .stubStream(
      "search",
      [
        {type: "TaskStart", task_id: 1},
        {type: "TaskEnd", task_id: 1}
      ],
      "always"
    )
  const store = initTestStore(mock.zealot)
  const cluster = fixtures(clusterName)
  const space = fixtures(spaceName)

  store.dispatch(Clusters.add(cluster))
  store.dispatch(Current.setConnectionId(cluster.id))
  store.dispatch(Spaces.setDetail(cluster.id, space))
  return store.dispatch(initSpace(space.name)).then(() => {
    return {store, cluster, zealot: mock}
  })
}
