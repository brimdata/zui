import {Thunk} from "../state/types"
import Notice from "../state/Notice"
import ErrorFactory from "../models/ErrorFactory"
import ConnectionStatuses from "../state/ConnectionStatuses"
import Current from "../state/Current"

export const handleZealotError = (error: Error): Thunk => (
  dispatch,
  getState
) => {
  console.error(error)

  const err = ErrorFactory.create(error)
  if (err.type === "NetworkError") {
    dispatch(
      ConnectionStatuses.set(
        Current.getConnectionId(getState()),
        "disconnected"
      )
    )

    return
  }

  dispatch(Notice.set(err))
}
