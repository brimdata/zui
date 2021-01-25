import Current from "../state/Current"
import Workspaces from "../state/Workspaces"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"
import {Workspace} from "../state/Workspaces/types"
import brim from "../brim"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import {WorkspaceStatus} from "../state/WorkspaceStatuses/types"
import {Dispatch} from "../state/types"
import {getAuth0Token} from "./getAuth0Token"

export const initWorkspace = (ws: Workspace, redirectToLogin = false) => async (
  dispatch,
  getState,
  {createZealot}
): Promise<boolean | void> => {
  const zealot = createZealot(brim.workspace(ws).getAddress())

  const workspace = {...ws}

  try {
    // check version to test that zqd is available, update workspace version while doing so
    const {version} = await zealot.version()
    workspace.version = version

    // first time connection, need to determine auth type and set data accordingly
    if (!workspace.authType) {
      const authMethod = await zealot.authMethod()
      if (authMethod.kind === "auth0") {
        const {client_id: clientId, domain} = authMethod.auth0
        workspace.authType = "auth0"
        workspace.authData = {
          clientId,
          domain
        }
      } else {
        workspace.authType = "none"
      }
    }

    // no auth required
    if (workspace.authType === "none") {
      setupWorkspace(dispatch, workspace, "connected")
      return
    }

    // if auth is required, and method is auth0...
    if (workspace.authType === "auth0") {
      // ...and we have logged in before
      if (workspace.authData.accessToken) {
        setupWorkspace(dispatch, workspace, "connected")
        return
      }

      // otherwise, need to retrieve accessToken. If login required, automatically redirect to browser
      const accessToken = await dispatch(
        getAuth0Token(workspace, redirectToLogin)
      )
      if (!accessToken) {
        if (redirectToLogin) {
          setupWorkspace(dispatch, workspace, "authenticating")
          return true
        } else setupWorkspace(dispatch, workspace, "login")
      }
    }
  } catch (e) {
    console.error("initWorkspace error: ", e)
    dispatch(WorkspaceStatuses.set(workspace.id, "disconnected"))
    throw e
  }
}

const setupWorkspace = (
  dispatch: Dispatch,
  ws: Workspace,
  status: WorkspaceStatus
) => {
  dispatch(Workspaces.add(ws))
  dispatch(WorkspaceStatuses.set(ws.id, status))
  globalDispatch(Workspaces.add(ws)).then(() => {
    if (status === "authenticating") return
    dispatch(Current.setWorkspaceId(ws.id))
    if (status === "login") return
    dispatch(refreshSpaceNames())
  })
}
