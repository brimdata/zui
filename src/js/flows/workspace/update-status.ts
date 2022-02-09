import {Client} from "@brimdata/zealot"
import {syncPoolsData} from "app/core/pools/sync-pools-data"
import {validateToken} from "../../auth0/utils"
import brim from "../../brim"
import Lakes from "../../state/Lakes"
import WorkspaceStatuses from "../../state/WorkspaceStatuses"
import {getAuthCredentials} from "./getAuthCredentials"

/**
 * Updates a workspaces status by trying to connect
 * @param workspaceId
 */
export const updateStatus = (workspaceId: string) => async (
  dispatch,
  getState
): Promise<void> => {
  const ws = brim.workspace(Lakes.id(workspaceId)(getState()))
  const zealot = new Client(ws.getAddress())

  const activate = async () => {
    await dispatch(syncPoolsData())
    dispatch(WorkspaceStatuses.set(ws.id, "connected"))
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
      return true
    }
  }

  if (await isDown()) return

  // update version
  dispatch(Lakes.add(ws.serialize()))

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
      dispatch(Lakes.setLakeToken(ws.id, accessToken))
      activate()
      return
    }

    // otherwise login is required, send user to our 'login' page and let them initiate the flow there
    dispatch(WorkspaceStatuses.set(ws.id, "login-required"))
    return
  }

  throw new Error("unknown auth type: " + ws.authType)
}
