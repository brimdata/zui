import {createFetcher, FetchArgs, Zealot} from "zealot"
import Current from "../state/Current"
import {Thunk} from "../state/types"
import ErrorFactory from "../models/ErrorFactory"
import ConnectionStatuses from "../state/ConnectionStatuses"

export const getZealot = (): Thunk<Zealot> => (
  dispatch,
  getState,
  {createZealot}
) => {
  const conn = Current.mustGetConnection(getState())

  const {host, port} = conn
  const hostPort = [host, port].join(":")

  const wrappedFetcher = (hostPort: string) => {
    const {promise, stream} = createFetcher(hostPort)

    const wrappedPromise = (args: FetchArgs): Promise<any> => {
      return promise(args).catch((e) => {
        if (ErrorFactory.create(e).type === "NetworkError") {
          dispatch(
            ConnectionStatuses.set(
              Current.getConnectionId(getState()),
              "disconnected"
            )
          )
        }
        throw e
      })
    }

    return {promise: wrappedPromise, stream}
  }

  return createZealot(hostPort, {
    fetcher: wrappedFetcher
  })
}
