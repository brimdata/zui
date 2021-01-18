import Current from "../state/Current"
import Workspaces from "../state/Workspaces"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"
import {Workspace} from "../state/Workspaces/types"
import brim from "../brim"
import WorkspaceStatuses from "../state/WorkspaceStatuses"

export const initWorkspace = (workspace: Workspace) => (
  dispatch,
  getState,
  {createZealot}
): Promise<void> => {
  const zealot = createZealot(brim.workspace(workspace).getAddress())
  return zealot
    .version()
    .then(({version}) => {
      const connectedWorkspace: Workspace = {
        ...workspace,
        version
      }
      dispatch(Workspaces.add(connectedWorkspace))
      dispatch(WorkspaceStatuses.set(workspace.id, "connected"))
      globalDispatch(Workspaces.add(connectedWorkspace)).then(() => {
        dispatch(Current.setWorkspaceId(workspace.id))
        dispatch(refreshSpaceNames())
      })
    })
    .catch((e) => {
      dispatch(WorkspaceStatuses.set(workspace.id, "disconnected"))
      throw e
    })
}
