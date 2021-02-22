import {validateToken} from "../../auth0/utils"
import brim from "../../brim"
import Current from "../../state/Current"
import Workspaces from "../../state/Workspaces"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import refreshSpaceNames from "../refreshSpaceNames"
import {getAuthCredentials} from "./getAuthCredentials"

export const activateWorkspace = (workspaceId: string) => async (
  dispatch,
  getState,
  {createZealot}
): Promise<void> => {
  const ws = brim.workspace(Workspaces.id(workspaceId)(getState()))
  const zealot = createZealot(ws.getAddress())

  const activate = async () => {
    console.log("refreshing the spaces")
    await dispatch(refreshSpaceNames())
    console.log("setting the connected")
    dispatch(WorkspaceStatuses.set(ws.id, "connected"))
    dispatch(Current.setWorkspaceId(ws.id))
  }

  const isDown = async () => {
    try {
      // check version to test that zqd is available, update workspace version while doing so
      const {version} = await zealot.version()
      ws.version = version
      return false
    } catch (e) {
      console.error(e)
      dispatch(WorkspaceStatuses.set(ws.id, "disconnected"))
      dispatch(Current.setWorkspaceId(ws.id))
      return true
    }
  }

  if (await isDown()) return

  // update version
  dispatch(Workspaces.add(ws.serialize()))

  // no auth required
  if (ws.authType === "none") {
    activate()
    return
  }

  // auth required, if method is auth0...
  if (ws.authType === "auth0") {
    // ...and we already have the token
    if (validateToken(ws.authData.accessToken)) {
      activate()
      return
    }

    // otherwise, need to refresh accessToken
    const accessToken = await dispatch(getAuthCredentials(ws))
    if (accessToken) {
      dispatch(Workspaces.setWorkspaceToken(ws.id, accessToken))
      activate()
      return
    }

    // otherwise login is required, send user to our 'login' page and let them initiate the flow there
    dispatch(WorkspaceStatuses.set(ws.id, "login-required"))
    dispatch(Current.setWorkspaceId(ws.id))
    return
  }

  throw new Error("unknown auth type: " + ws.authType)
}
