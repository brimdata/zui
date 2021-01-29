import {Thunk} from "../../state/types"
import {toAccessTokenKey, toRefreshTokenKey, validateToken} from "../../auth0"
import {getAuth0} from "./getAuth0"
import invoke from "../../electron/ipc/invoke"
import ipc from "../../electron/ipc"
import {Workspace} from "../../state/Workspaces/types"

export const getAuthCredentials = (
  ws: Workspace
): Thunk<Promise<string | null>> => async (dispatch) => {
  if (!ws.authType || ws.authType !== "auth0" || !ws.authData)
    throw new Error("No auth data set for workspace")

  // first, check if accessToken is in keychain
  let accessToken = await invoke(
    ipc.secretsStorage.getKey(toAccessTokenKey(ws.id))
  )
  // check that token exists, is formatted properly, and not expired
  if (validateToken(accessToken)) return accessToken

  // if no accessToken (or expired/malformed), then check for refreshToken
  const refreshToken = await invoke(
    ipc.secretsStorage.getKey(toRefreshTokenKey(ws.id))
  )
  if (!refreshToken) {
    // login is required
    return null
  }

  const client = dispatch(getAuth0(ws))
  try {
    accessToken = await client.refreshAccessToken(refreshToken)
  } catch (e) {
    // refreshToken failed (may have been rotated), log error and require user login
    console.error(e)
    return null
  }

  // successfully refreshed, update in keychain and then return
  await invoke(ipc.secretsStorage.setKey(toAccessTokenKey(ws.id), accessToken))
  return accessToken
}
