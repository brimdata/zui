import {createFetcher, FetchArgs, Zealot} from "zealot"
import Current from "../state/Current"
import {Thunk} from "../state/types"
import ErrorFactory from "../models/ErrorFactory"
import ConnectionStatuses from "../state/ConnectionStatuses"

const createBrimFetcher = (dispatch, getState) => {
  return (hostPort: string) => {
    const {promise, ...rest} = createFetcher(hostPort)

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

    return {promise: wrappedPromise, ...rest}
  }
}

export const getZealot = (): Thunk<Zealot> => (
  dispatch,
  getState,
  {createZealot}
) => {
  const conn = Current.mustGetConnection(getState())

  return createZealot(conn.getAddress(), {
    fetcher: createBrimFetcher(dispatch, getState)
  })
}
