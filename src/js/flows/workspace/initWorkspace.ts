import Current from "../../state/Current"
import Workspaces from "../../state/Workspaces"
import {globalDispatch} from "../../state/GlobalContext"
import {Workspace} from "../../state/Workspaces/types"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import {WorkspaceStatus} from "../../state/WorkspaceStatuses/types"
import refreshSpaceNames from "../refreshSpaceNames"

export const initWorkspace = (ws: Workspace, status: WorkspaceStatus) => (
  dispatch
): void => {
  dispatch(Workspaces.add(ws))
  dispatch(WorkspaceStatuses.set(ws.id, status))
  globalDispatch(Workspaces.add(ws)).then(() => {
    dispatch(Current.setWorkspaceId(ws.id))
    dispatch(refreshSpaceNames())
  })
}
