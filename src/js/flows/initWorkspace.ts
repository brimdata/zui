import Current from "../state/Current"
import Workspaces from "../state/Workspaces"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"
import {Workspace} from "../state/Workspaces/types"
import brim from "../brim"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import {Authenticator as Auth} from "../auth"
import {WorkspaceStatus} from "../state/WorkspaceStatuses/types"
import {Dispatch} from "../state/types"

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
      /*

      // otherwise, need to retrieve accessToken. First check if login required by
      // seeing if we have the refresh token
      const refreshToken = await invoke(
        ipc.windows.keyChain(auth.storageKey(ws.id))
      )
      if (refreshToken) {
        // silent refresh
        // setupWorkspace(dispatch, workspace, "connected")
        // return
      }

      // login is required
      // if being created through "New Workspace..." flow automatically redirect, otherwise
      // set connectionStatus to "login" so user may be informed and initiate login flow on their own
      */
      if (!redirectToLogin) {
        setupWorkspace(dispatch, workspace, "login")
        return
      }
      // otherwise, need to retrieve accessToken for first time
      const {clientId, domain} = workspace.authData
      // set workspaceId and windowId in "state" query param so that it may be
      // received by the brim://callback handler after user completes authentication
      // in their browser and is redirected back to Brim
      const state = Auth.serializeState(workspace.id, global.windowId)
      await new Auth(
        brim.workspace(workspace).getAddress(),
        clientId,
        domain
      ).login(state)

      setupWorkspace(dispatch, workspace, "authenticating")

      // return true to indicate to caller that login flow initiated
      return true
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
