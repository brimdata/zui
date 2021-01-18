import {createFetcher, FetchArgs, Zealot} from "zealot"
import Current from "../state/Current"
import {Thunk} from "../state/types"
import ErrorFactory from "../models/ErrorFactory"
import WorkspaceStatuses from "../state/WorkspaceStatuses"
import {Authenticator} from "../auth"
import {BrimWorkspace} from "../brim"
import {ZFetcher, ZReponse} from "../../../zealot/types"

const getAuthHeaderForConn = async (ws: BrimWorkspace): Promise<string> => {
  // TODO: store accessToken in redux and/or keychain, and use (also check if expired before use)
  // const authenticator = new Authenticator(`http://${conn.getAddress()}`)
  // const {clientID, domain, accessToken} = ws.auth
  const authenticator = new Authenticator("replace", "all", "this")
  let token
  try {
    await authenticator.refreshTokens()
    token = authenticator.getAccessToken()
  } catch {
    await authenticator.login()
    // TODO: How to come back here after login? or equivalent retry functionality
  }

  return `Bearer ${token}`
}

const createBrimFetcher = (dispatch, getState) => {
  return (hostPort: string): ZFetcher => {
    const {promise, stream, ...rest} = createFetcher(hostPort)

    // const headers

    const wrappedPromise = async (args: FetchArgs): Promise<any> => {
      const conn = Current.mustGetWorkspace(getState())

      // TODO: add auth flag to each workspace/connection
      // if (conn.authEnabled)...
      if (conn.auth) {
        const value = await getAuthHeaderForConn(conn)
        if (args.headers) args.headers.append("Authorization", value)
        else args.headers = new Headers({Authorization: value})
      }

      console.log({args})
      console.log("headers in getZealot: ", args.headers && args.headers.keys())
      if (args.headers) {
        let keys = []
        for (let k of args.headers.keys()) keys.push(k)
        console.log("keys are: ", keys)
      }
      return promise(args).catch((e) => {
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

      // if (conn.authEnabled)...
      if (ws.auth) {
        const value = await getAuthHeaderForConn(ws)
        if (args.headers) args.headers.append("Authorization", value)
        else args.headers = new Headers({Authorization: value})
      }

      return stream(args)
    }

    return {promise: wrappedPromise, stream: wrappedStream, ...rest}
  }
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
