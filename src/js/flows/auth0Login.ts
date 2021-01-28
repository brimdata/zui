import {Thunk} from "../state/types"
import {serializeState, toAccessTokenKey, toRefreshTokenKey} from "../auth0"
import {Workspace} from "../state/Workspaces/types"
import {getAuth0} from "./getAuth0"
import {ipcRenderer, remote} from "electron"
import invoke from "../electron/ipc/invoke"
import ipc from "../electron/ipc"

export type CancelLoginListener = () => void

export const auth0Login = (
  ws: Workspace,
  cb: (accessToken: string | null) => void,
  confirmDialog = false
) => async (dispatch): Promise<CancelLoginListener | null> => {
  const client = dispatch(getAuth0(ws))
  if (confirmDialog) {
    const dialogOpts = {
      type: "info",
      buttons: ["Continue", "Cancel"],
      title: "Redirect to Browser",
      message:
        "This Workspace requires authentication. Continue to login with your browser?"
    }

    const dialogChoice = await remote.dialog.showMessageBox(dialogOpts)
    if (dialogChoice.response === 1) return null
  }

  await client.login(
    serializeState({workspaceId: ws.id, windowId: global.windowId})
  )

  const handleAuthCallback = async (e, {workspaceId, code}) => {
    try {
      const {accessToken, refreshToken} = await client.exchangeCode(code)

      // store both tokens in os default keychain
      await invoke(
        ipc.windows.setKeyStorage(toAccessTokenKey(workspaceId), accessToken)
      )
      await invoke(
        ipc.windows.setKeyStorage(toRefreshTokenKey(workspaceId), refreshToken)
      )

      cb(accessToken)
    } catch (e) {
      console.error("error exchanging code: ", e)
      cb(null)
      throw e
    }
  }

  ipcRenderer.once("windows:authCallback", handleAuthCallback)

  return () => {
    ipcRenderer.removeListener("windows:authCallback", handleAuthCallback)
  }
}
