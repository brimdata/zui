import {Thunk} from "../../state/types"
import {LakeAttrs} from "../../state/Lakes/types"
import {buildLake} from "./buildLake"
import {getAuthCredentials} from "./getAuthCredentials"
import {saveLake} from "./saveLake"
import {login} from "./login"
import {showMessageBox} from "src/js/lib/System"

export class LoginError extends Error {
  readonly name: string = "LoginError"
  readonly message: string = "Login failed"

  constructor(readonly cause: Error) {
    super()
  }
}

export class ConnectionError extends Error {
  readonly name: string = "ConnectionError"
  readonly message: string = "Unable to connect to lake"

  constructor(readonly cause: Error) {
    super()
  }
}

type Cancelled = boolean
type LakeError = LoginError | ConnectionError | null

export const buildAndAuthenticateLake =
  (
    attrs: Partial<LakeAttrs>,
    abortSignal: AbortSignal
  ): Thunk<Promise<[Cancelled, LakeError]>> =>
  async (dispatch) => {
    try {
      const lake = await dispatch(buildLake(attrs, abortSignal))

      if (lake.authType === "none") {
        dispatch(saveLake(lake.attrs, "connected"))
        return [false, null]
      }

      let accessToken = await dispatch(getAuthCredentials(lake))
      if (accessToken) {
        dispatch(
          saveLake(
            {...lake.attrs, authData: {...lake.authData, accessToken}},
            "connected"
          )
        )
        return [false, null]
      }

      const dialogChoice = await showMessageBox({
        type: "info",
        buttons: ["Continue", "Cancel"],
        title: "Redirect to Browser",
        message:
          "This lake requires authentication. Continue to log in with your browser?",
      })
      if (dialogChoice.response === 1) return [true, null]

      try {
        accessToken = await dispatch(login(lake, abortSignal))
        if (abortSignal.aborted) return [true, null]
        lake.authData.accessToken = accessToken
        dispatch(
          saveLake(
            {...lake.attrs, authData: {...lake.authData, accessToken}},
            "connected"
          )
        )
        return [false, null]
      } catch (e) {
        return [false, new LoginError(e)]
      }
    } catch (e) {
      if (abortSignal.aborted) return [true, null]
      return [false, new ConnectionError(e)]
    }
  }
