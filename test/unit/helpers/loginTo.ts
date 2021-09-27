import tabHistory from "app/router/tab-history"
import {lakePath} from "app/router/utils/paths"
import {createZealotMock, ZealotMock} from "zealot"
import Pools from "../../../src/js/state/Pools"
import Workspaces from "../../../src/js/state/Workspaces"
import {Workspace} from "../../../src/js/state/Workspaces/types"
import fixtures from "../fixtures"
import initTestStore, {TestStore} from "./initTestStore"

export default async function loginTo(
  workspaceName: string,
  poolName: string
): Promise<{store: TestStore; workspace: Workspace; zealot: ZealotMock}> {
  const mock = createZealotMock()
  mock
    .stubPromise("version", {version: "1"}, "always")
    .stubPromise("pools.list", [{name: "dataPool", id: "1"}], "always")
    .stubPromise("pools.get", {name: "dataPool", id: "1"}, "always")
    .stubStream(
      "query",
      [
        {kind: "QueryChannelSet", value: {channel_id: 0}},
        {kind: "QueryChannelEnd", value: {channel_id: 0}}
      ],
      "always"
    )
  const store = initTestStore(mock.zealot)
  const workspace = fixtures(workspaceName)
  const pool = fixtures(poolName)

  store.dispatch(Workspaces.add(workspace))
  store.dispatch(Pools.setDetail(workspace.id, pool))
  store.dispatch(tabHistory.push(lakePath(pool.id, workspace.id)))
  return {store, workspace, zealot: mock}
}
