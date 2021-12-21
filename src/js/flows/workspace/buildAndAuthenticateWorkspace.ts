import * as remote from "@electron/remote"
import {Thunk} from "../../state/types"
import {Workspace} from "../../state/Workspaces/types"
import {buildWorkspace} from "./buildWorkspace"
import {getAuthCredentials} from "./getAuthCredentials"
import {saveWorkspace} from "./saveWorkspace"
import {login} from "./login"

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
type WorkspaceError = LoginError | ConnectionError | null

export const buildAndAuthenticateWorkspace = (
  workspace: Partial<Workspace>,
  abortSignal: AbortSignal
): Thunk<Promise<[Cancelled, WorkspaceError]>> => async (dispatch) => {
  try {
    const ws = await dispatch(buildWorkspace(workspace, abortSignal))

    if (ws.authType === "none") {
      dispatch(saveWorkspace(ws, "connected"))
      return [false, null]
    }

    let accessToken = await dispatch(getAuthCredentials(ws))
    if (accessToken) {
      dispatch(
        saveWorkspace(
          {...ws, authData: {...ws.authData, accessToken}},
          "connected"
        )
      )
      return [false, null]
    }

    const dialogOpts = {
      type: "info",
      buttons: ["Continue", "Cancel"],
      title: "Redirect to Browser",
      message:
        "This lake requires authentication. Continue to log in with your browser?"
    }
    const dialogChoice = await remote.dialog.showMessageBox(dialogOpts)
    if (dialogChoice.response === 1) return [true, null]

    try {
      accessToken = await dispatch(login(ws, abortSignal))
      if (abortSignal.aborted) return [true, null]
      ws.authData.accessToken = accessToken
      dispatch(
        saveWorkspace(
          {...ws, authData: {...ws.authData, accessToken}},
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
