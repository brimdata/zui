import {Thunk} from "../../state/types"
import {Lake} from "../../state/Lakes/types"
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
    lake: Partial<Lake>,
    abortSignal: AbortSignal
  ): Thunk<Promise<[Cancelled, LakeError]>> =>
  async (dispatch) => {
    try {
      const l = await dispatch(buildLake(lake, abortSignal))

      if (l.authType === "none") {
        dispatch(saveLake(l, "connected"))
        return [false, null]
      }

      let accessToken = await dispatch(getAuthCredentials(l))
      if (accessToken) {
        dispatch(
          saveLake({...l, authData: {...l.authData, accessToken}}, "connected")
        )
        return [false, null]
      }

      const dialogOpts = {
        type: "info",
        buttons: ["Continue", "Cancel"],
        title: "Redirect to Browser",
        message:
          "This lake requires authentication. Continue to log in with your browser?",
      }
      const dialogChoice = await showMessageBox(dialogOpts)
      if (dialogChoice.response === 1) return [true, null]

      try {
        accessToken = await dispatch(login(l, abortSignal))
        if (abortSignal.aborted) return [true, null]
        l.authData.accessToken = accessToken
        dispatch(
          saveLake({...l, authData: {...l.authData, accessToken}}, "connected")
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
