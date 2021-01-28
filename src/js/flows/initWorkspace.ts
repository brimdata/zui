import Current from "../state/Current"
import Workspaces from "../state/Workspaces"
import {globalDispatch} from "../state/GlobalContext"
import {Workspace} from "../state/Workspaces/types"
import brim from "../brim"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import {WorkspaceStatus} from "../state/WorkspaceStatuses/types"
import {Dispatch} from "../state/types"
import isEmpty from "lodash/isEmpty"
import {refreshAuth0AccessToken} from "./refreshAuth0AccessToken"
import {auth0Login, CancelLoginListener} from "./auth0Login"

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
  })
}

export const initWorkspace = (
  ws: Workspace,
  loginCb: (isLoggingIn: boolean) => void
) => async (
  dispatch,
  getState,
  {createZealot}
): Promise<CancelLoginListener | null> => {
  const zealot = createZealot(brim.workspace(ws).getAddress())

  const workspace = {...ws}

  // cannot provide authType from form, if not present must be new workspace
  const isNewWorkspace = isEmpty(workspace.authType)

  // check version to test that zqd is available, retrieve version while doing so
  const {version} = await zealot.version()
  workspace.version = version

  // first time connection, need to determine auth type and set data accordingly
  if (isNewWorkspace) {
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
    return null
  }

  // if auth is required, and method is auth0...
  if (workspace.authType === "auth0") {
    // ...and we have logged in before
    if (workspace.authData.accessToken) {
      setupWorkspace(dispatch, workspace, "connected")
      return null
    }

    // if workspace already exists, try refresh
    if (!isNewWorkspace) {
      const accessToken = await dispatch(refreshAuth0AccessToken(workspace))
      if (accessToken) {
        setupWorkspace(
          dispatch,
          {...workspace, authData: {...workspace.authData, accessToken}},
          "connected"
        )
        return null
      }
    }

    const handleLoginResult = (accessToken) => {
      if (accessToken) {
        setupWorkspace(
          dispatch,
          {...workspace, authData: {...workspace.authData, accessToken}},
          "connected"
        )
      }

      loginCb(false)
    }
    loginCb(true)
    return await dispatch(auth0Login(workspace, handleLoginResult, true))
  }

  throw new Error("unknown authType")
}
