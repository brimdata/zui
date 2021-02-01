import Current from "../../state/Current"
import Workspaces from "../../state/Workspaces"
import refreshSpaceNames from "../refreshSpaceNames"
import {globalDispatch} from "../../state/GlobalContext"
import brim from "../../brim"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import {getAuthCredentials} from "./getAuthCredentials"
import {validateToken} from "../../auth0"

export const activateWorkspace = (workspaceId: string) => async (
  dispatch,
  getState,
  {createZealot}
): Promise<void> => {
  const ws = Workspaces.id(workspaceId)(getState())
  const zealot = createZealot(brim.workspace(ws).getAddress())

  const workspace = {...ws}

  const activate = () => {
    dispatch(WorkspaceStatuses.set(workspace.id, "connected"))
    dispatch(Current.setWorkspaceId(ws.id))
    dispatch(refreshSpaceNames())
  }

  try {
    // check version to test that zqd is available, update workspace version while doing so
    const {version} = await zealot.version()
    workspace.version = version
  } catch (e) {
    console.error(e)
    dispatch(WorkspaceStatuses.set(workspace.id, "disconnected"))
    dispatch(Current.setWorkspaceId(workspace.id))
    return
  }
  // update version
  dispatch(Workspaces.add(workspace))
  await globalDispatch(Workspaces.add(workspace))

  // no auth required
  if (workspace.authType === "none") {
    activate()
    return
  }

  // if auth is required, and method is auth0...
  if (workspace.authType === "auth0") {
    // ...and we already have the token
    if (validateToken(workspace.authData.accessToken)) {
      activate()
      return
    }

    // otherwise, need to refresh accessToken
    const accessToken = await dispatch(getAuthCredentials(workspace))
    if (accessToken) {
      dispatch(Workspaces.setWorkspaceToken(workspace.id, accessToken))
      await globalDispatch(
        Workspaces.setWorkspaceToken(workspace.id, accessToken)
      )
      activate()
      return
    }

    // otherwise login is required, send user to our 'login' page and let them initiate the flow there
    dispatch(WorkspaceStatuses.set(workspace.id, "login-required"))
    dispatch(Current.setWorkspaceId(ws.id))
    return
  }

  throw new Error("unknown auth type: " + workspace.authType)
}
