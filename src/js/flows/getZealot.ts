import {createFetcher, FetchArgs, Zealot} from "zealot"
import {ZFetcher, ZResponse} from "../../../zealot/types"
import {validateToken} from "../auth0/utils"
import {BrimWorkspace} from "../brim"
import ErrorFactory from "../models/ErrorFactory"
import Current from "../state/Current"
import {Thunk} from "../state/types"
import Workspaces from "../state/Workspaces"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import {getAuthCredentials} from "./workspace/getAuthCredentials"

const createBrimFetcher = (dispatch, getState, workspace: BrimWorkspace) => {
  return (hostPort: string): ZFetcher => {
    const {promise, stream, upload} = createFetcher(hostPort)

    const setWorkspaceAuthArgs = async (
      ws: BrimWorkspace,
      args: FetchArgs
    ): Promise<FetchArgs> => {
      if (!ws.authType || ws.authType === "none") return {...args}

      const newArgs = {...args}

      let {accessToken} = ws.authData
      if (!validateToken(accessToken)) {
        // attempt refresh
        accessToken = await dispatch(getAuthCredentials(ws))
        if (!accessToken) {
          // inform user login required by updating status
          dispatch(WorkspaceStatuses.set(ws.id, "login-required"))
          return args
        }

        await dispatch(Workspaces.setWorkspaceToken(ws.id, accessToken))
      }

      const bearerToken = `Bearer ${accessToken}`
      if (newArgs.headers) newArgs.headers.append("Authorization", bearerToken)
      else newArgs.headers = new Headers({Authorization: bearerToken})

      return newArgs
    }

    const wrappedPromise = async (args: FetchArgs): Promise<any> => {
      return promise(await setWorkspaceAuthArgs(workspace, args)).catch((e) => {
        if (ErrorFactory.create(e).type === "NetworkError") {
          dispatch(
            WorkspaceStatuses.set(
              Current.getWorkspaceId(getState()),
              "disconnected"
            )
          )
        }
        throw e
      })
    }

    const wrappedStream = async (args: FetchArgs): Promise<ZResponse> => {
      return stream(await setWorkspaceAuthArgs(workspace, args))
    }

    const wrappedUpload = async (args: FetchArgs): Promise<ZResponse> => {
      return upload(await setWorkspaceAuthArgs(workspace, args))
    }

    return {
      promise: wrappedPromise,
      stream: wrappedStream,
      upload: wrappedUpload
    }
  }
}

export const getZealot = (workspace?: BrimWorkspace): Thunk<Zealot> => (
  dispatch,
  getState,
  {createZealot}
) => {
  const ws = workspace || Current.mustGetWorkspace(getState())

  return createZealot(ws.getAddress(), {
    fetcher: createBrimFetcher(dispatch, getState, ws)
  })
}
