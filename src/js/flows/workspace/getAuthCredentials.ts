import {Thunk} from "../../state/types"
import {toAccessTokenKey, toRefreshTokenKey} from "../../auth0"
import {getAuth0} from "./getAuth0"
import invoke from "../../electron/ipc/invoke"
import ipc from "../../electron/ipc"
import {Workspace} from "../../state/Workspaces/types"
import jwtDecode, {JwtPayload} from "jwt-decode"

export const getAuthCredentials = (
  ws: Workspace
): Thunk<Promise<string | null>> => async (dispatch) => {
  if (!ws.authType || ws.authType !== "auth0" || !ws.authData)
    throw new Error("No auth data set for workspace")

  // first, check if accessToken is in keychain
  let accessToken = await invoke(
    ipc.windows.getKeyStorage(toAccessTokenKey(ws.id))
  )
  if (accessToken) {
    // check that token is formatted properly and not expired
    try {
      const {exp} = jwtDecode<JwtPayload>(accessToken)
      // if token has not expired, return it
      if (Date.now() < exp * 1000) {
        console.log("token has not expired")
        return accessToken
      }
    } catch (e) {
      // log this but don't throw, we will try to refresh instead
      console.error("invalid token: ", e)
    }
  }

  // if no accessToken (or expired), then check for refreshToken
  const refreshToken = await invoke(
    ipc.windows.getKeyStorage(toRefreshTokenKey(ws.id))
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
    console.error("unable to refresh token: ", e)
    return null
  }

  // successfully refreshed, update in keychain and then return
  await invoke(ipc.windows.setKeyStorage(toAccessTokenKey(ws.id), accessToken))
  return accessToken
}
