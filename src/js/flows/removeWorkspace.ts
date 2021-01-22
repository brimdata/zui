import Workspaces from "../state/Workspaces"
import {Thunk} from "../state/types"
import {popNotice} from "../components/PopNotice"
import {Workspace} from "../state/Workspaces/types"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import Investigation from "../state/Investigation"

const removeWorkspace = (ws: Workspace): Thunk => (
  dispatch,
  _getState,
  {globalDispatch}
) => {
  const {name, id, host, port} = ws

  if (host === "localhost" && port === "9867")
    throw new Error("Cannot remove the default workspace")

  dispatch(Current.setSpaceId(null))
  dispatch(Current.setWorkspaceId(null))
  dispatch(Investigation.clearWorkspaceInvestigation(id))
  dispatch(Spaces.removeForWorkspace(id))
  dispatch(WorkspaceStatuses.remove(id))
  globalDispatch(Workspaces.remove(id))
  popNotice(`Removed workspace "${name}"`)
}

export default removeWorkspace
