import Workspaces from "../../state/Workspaces"
import {Thunk} from "../../state/types"
import {popNotice} from "../../components/PopNotice"
import {Workspace} from "../../state/Workspaces/types"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import Current from "../../state/Current"
import Spaces from "../../state/Spaces"
import Investigation from "../../state/Investigation"
import invoke from "../../electron/ipc/invoke"
import {toAccessTokenKey, toRefreshTokenKey} from "../../auth0"
import ipc from "../../electron/ipc"
import {isDefaultWorkspace} from "../../initializers/initWorkspaceParams"

const removeWorkspace = (ws: Workspace): Thunk => (
  dispatch,
  _getState,
  {globalDispatch}
) => {
  const {name, id, authType} = ws

  if (isDefaultWorkspace(ws))
    throw new Error("Cannot remove the default workspace")

  // remove creds from keychain
  if (authType === "auth0") {
    invoke(ipc.secretsStorage.deleteKey(toAccessTokenKey(id)))
    invoke(ipc.secretsStorage.deleteKey(toRefreshTokenKey(id)))
  }
  dispatch(Current.setSpaceId(null))
  dispatch(Current.setWorkspaceId(null))
  dispatch(Investigation.clearWorkspaceInvestigation(id))
  dispatch(Spaces.removeForWorkspace(id))
  dispatch(WorkspaceStatuses.remove(id))
  globalDispatch(Workspaces.remove(id))
  popNotice(`Removed workspace "${name}"`)
}

export default removeWorkspace
