import Current from "../state/Current"
import Workspaces from "../state/Workspaces"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"
import {Workspace} from "../state/Workspaces/types"
import brim from "../brim"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import {Authenticator} from "../auth"

export const initWorkspace = (workspace: Workspace) => (
  dispatch,
  getState,
  {createZealot}
): Promise<void> => {
  const zealot = createZealot(brim.workspace(workspace).getAddress())
  const connectedWorkspace: Workspace = {
    ...workspace
  }
  return zealot
    .version()
    .then(({version}) => {
      connectedWorkspace.version = version
      return zealot.authMethod()
    })
    .then((authMethod) => {
      if (authMethod.kind === "auth0") {
        const {client_id: clientId, domain} = authMethod.auth0
        connectedWorkspace.auth = {
          clientId,
          domain
        }

        new Authenticator(
          brim.workspace(workspace).getAddress(),
          clientId,
          domain
        ).login(workspace.id)
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
