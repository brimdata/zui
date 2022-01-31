import syncPools from "app/core/pools/sync-pools"
import tabHistory from "app/router/tab-history"
import {BrimLake} from "../../brim"
import Lakes from "../../state/Lakes"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import {WorkspaceStatus} from "../../state/WorkspaceStatuses/types"

export const saveWorkspace = (ws: BrimLake, status: WorkspaceStatus) => (
  dispatch,
  _gs
): void => {
  dispatch(Lakes.add(ws.serialize()))
  dispatch(WorkspaceStatuses.set(ws.id, status))
  dispatch(Lakes.add(ws.serialize()))
  dispatch(tabHistory.push(`/workspaces/${ws.id}`))
  dispatch(syncPools())
}
