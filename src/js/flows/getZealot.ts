import {createFetcher, FetchArgs, Zealot} from "zealot"
import Current from "../state/Current"
import {Thunk} from "../state/types"
import ErrorFactory from "../models/ErrorFactory"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import {Authenticator} from "../auth0"
import {BrimWorkspace} from "../brim"
import {ZFetcher, ZReponse} from "../../../zealot/types"

const getAuthHeaderForWorkspace = async (
  ws: BrimWorkspace
): Promise<string> => {
  const {clientId, domain, accessToken} = ws.authData
  // use existing accessToken if available
  if (accessToken) return `Bearer ${accessToken}`

  const authenticator = new Authenticator(ws.getAddress(), clientId, domain)
  let token
  try {
    // else, attempt to use refresh token from keychain to automatically renew access token
    await authenticator.refreshTokens()
    token = authenticator.getAccessToken()
  } catch {
    // else, user login flow must be initiated
    console.log("must login now :(((")
    // await authenticator.login(ws.id)
  }

  return `Bearer ${token}`
}

const createBrimFetcher = (dispatch, getState) => {
  return (hostPort: string): ZFetcher => {
    const {promise, stream, ...rest} = createFetcher(hostPort)

    const wrappedPromise = async (args: FetchArgs): Promise<any> => {
      const ws = Current.mustGetWorkspace(getState())
      return promise(await setWorkspaceAuthArgs(ws, args)).catch((e) => {
        // TODO: Mason - if auth required and existing accessToken returns 401, refresh and try once more (i.e. refresh flow)
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

    const wrappedStream = async (args: FetchArgs): Promise<ZReponse> => {
      const ws = Current.mustGetWorkspace(getState())
      return stream(await setWorkspaceAuthArgs(ws, args))
    }

    return {promise: wrappedPromise, stream: wrappedStream, ...rest}
  }
}

const setWorkspaceAuthArgs = async (
  ws: BrimWorkspace,
  args: FetchArgs
): Promise<FetchArgs> => {
  if (!ws.authType || ws.authType === "none") return {...args}

  const newArgs = {...args}

  const value = await getAuthHeaderForWorkspace(ws)
  if (newArgs.headers) newArgs.headers.append("Authorization", value)
  else newArgs.headers = new Headers({Authorization: value})

  return newArgs
}

export const getZealot = (): Thunk<Zealot> => (
  dispatch,
  getState,
  {createZealot}
) => {
  const ws = Current.mustGetWorkspace(getState())

  return createZealot(ws.getAddress(), {
    fetcher: createBrimFetcher(dispatch, getState)
  })
}
