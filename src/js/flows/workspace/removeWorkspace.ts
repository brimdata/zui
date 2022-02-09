import tabHistory from "app/router/tab-history"
import {workspacesPath} from "app/router/utils/paths"
import toast from "react-hot-toast"
import {toAccessTokenKey, toRefreshTokenKey} from "../../auth0/utils"
import ipc from "../../electron/ipc"
import invoke from "../../electron/ipc/invoke"
import {isDefaultWorkspace} from "../../initializers/initWorkspaceParams"
import Investigation from "../../state/Investigation"
import Pools from "../../state/Pools"
import {Thunk} from "../../state/types"
import Lakes from "../../state/Lakes"
import {Lake} from "../../state/Lakes/types"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"

const removeWorkspace = (ws: Lake): Thunk => (dispatch, _getState) => {
  const {name, id, authType} = ws

  if (isDefaultWorkspace(ws)) throw new Error("Cannot remove the default lake")

  // remove creds from keychain
  if (authType === "auth0") {
    invoke(ipc.secrets.deleteKey(toAccessTokenKey(id)))
    invoke(ipc.secrets.deleteKey(toRefreshTokenKey(id)))
  }
  dispatch(Investigation.clearWorkspaceInvestigation(id))
  dispatch(Pools.removeAll(id))
  dispatch(WorkspaceStatuses.remove(id))
  dispatch(Lakes.remove(id))

  dispatch(tabHistory.push(workspacesPath()))
  toast(`Removed lake "${name}"`)
}

export default removeWorkspace
