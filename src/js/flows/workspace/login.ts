import {serializeState, toAccessTokenKey, toRefreshTokenKey} from "../../auth0"
import {Workspace} from "../../state/Workspaces/types"
import {getAuth0} from "./getAuth0"
import {ipcRenderer} from "electron"
import invoke from "../../electron/ipc/invoke"
import ipc from "../../electron/ipc"

export type CancelLoginListener = () => void

export const login = (
  ws: Workspace,
  cb: (accessToken: string | null) => void
) => async (dispatch): Promise<CancelLoginListener | null> => {
  const client = dispatch(getAuth0(ws))

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

  console.log("setting listener...")
  ipcRenderer.once("windows:authCallback", handleAuthCallback)

  return () => {
    console.log("cancelling listener...")
    ipcRenderer.removeListener("windows:authCallback", handleAuthCallback)
  }
}
