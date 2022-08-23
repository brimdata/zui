import {getSecretOp, setSecretOp} from "src/js/electron/ops/secrets"
import {
  toAccessTokenKey,
  toRefreshTokenKey,
  validateToken,
} from "../../auth0/utils"
import {BrimLake} from "../../brim"
import {Thunk} from "../../state/types"
import {getAuth0} from "./getAuth0"

export const getAuthCredentials =
  (lake: BrimLake): Thunk<Promise<string | null>> =>
  async (dispatch) => {
    if (!lake.authType || lake.authType !== "auth0" || !lake.authData)
      throw new Error("No authentication data set for lake")

    // first, check if accessToken is in keychain
    let accessToken = await getSecretOp.invoke({key: toAccessTokenKey(lake.id)})
    // check that token exists, is formatted properly, and not expired
    if (validateToken(accessToken)) return accessToken

    // if no accessToken (or expired/malformed), then check for refreshToken
    const refreshToken = await getSecretOp.invoke({
      key: toRefreshTokenKey(lake.id),
    })
    if (!refreshToken) {
      // login is required
      return null
    }

    const client = dispatch(getAuth0(lake))
    try {
      accessToken = await client.refreshAccessToken(refreshToken)
    } catch (e) {
      // refreshToken failed (may have been rotated), log error and require user login
      console.error(e)
      return null
    }

    // successfully refreshed, update in keychain and then return
    await setSecretOp.invoke({
      key: toAccessTokenKey(lake.id),
      val: accessToken,
    })

    return accessToken
  }
