import {Thunk} from "../state/types"
import {serializeState, toAccessTokenKey, toRefreshTokenKey} from "../auth0"
import {getAuth0} from "./getAuth0"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"
import {Workspace} from "../state/Workspaces/types"

export const getAuth0Token = (
  ws: Workspace,
  autoRedirect: boolean
): Thunk<Promise<string>> => async (dispatch) => {
  if (!ws.authType || ws.authType !== "auth0" || !ws.authData)
    throw new Error("No auth data set for workspace")

  let {accessToken} = ws.authData
  if (accessToken) return accessToken

  // accessToken not set in store, first check if it is in keychain
  accessToken = await invoke(ipc.windows.getKeyStorage(toAccessTokenKey(ws.id)))
  if (accessToken) {
    return accessToken
  }

  // if no accessToken, then check for refreshToken and use refresh flow
  const client = dispatch(getAuth0(ws))
  const refreshToken = await invoke(
    ipc.windows.getKeyStorage(toRefreshTokenKey(ws.id))
  )
  if (refreshToken) {
    accessToken = await client.refreshAccessToken(refreshToken)
    if (accessToken) {
      return accessToken
    }
  }

  // otherwise, user must login
  // send user to login required page, unless autoRedirect is specified
  if (!autoRedirect) {
    return ""
  }

  await client.login(
    serializeState({workspaceId: ws.id, windowId: global.windowId})
  )
  return ""
}
