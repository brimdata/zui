import Current from "../state/Current"
import Workspaces from "../state/Workspaces"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"
import {Workspace} from "../state/Workspaces/types"
import brim from "../brim"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import {refreshAuth0AccessToken} from "./refreshAuth0AccessToken"

export const activateWorkspace = (ws: Workspace) => async (
  dispatch,
  getState,
  {createZealot}
): Promise<void> => {
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
  await globalDispatch(Workspaces.add(workspace))

  // no auth required
  if (workspace.authType === "none") {
    activate()
    return
  }

  // if auth is required, and method is auth0...
  if (workspace.authType === "auth0") {
    // ...and we have logged in before
    if (workspace.authData.accessToken) {
      activate()
      return
    }

    // otherwise, need to refresh accessToken
    const accessToken = await dispatch(refreshAuth0AccessToken(workspace))
    if (accessToken) {
      activate()
      return
    }

    // otherwise login is required, send user to our 'login' page and let them initiate the flow there
    dispatch(WorkspaceStatuses.set(workspace.id, "login"))
    dispatch(Current.setWorkspaceId(ws.id))
    return
  }

  throw new Error("unknown auth type: " + workspace.authType)
}
