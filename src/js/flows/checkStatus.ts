import {Thunk} from "../state/types"
import Current from "../state/Current"
import Notice from "../state/Notice"
import ConnectionStatuses from "../state/ConnectionStatuses"

export const checkStatus = (): Thunk => (
  dispatch,
  getState,
  {createZealot}
) => {
  const {host, port, id} = Current.getConnection(getState())
  const hostPort = [host, port].join(":")

  // create default zealot client
  const zealot = createZealot(hostPort)

  return zealot.status().then(() => {
    dispatch(ConnectionStatuses.set(id, "connected"))
    dispatch(Notice.dismiss())
  })
}
