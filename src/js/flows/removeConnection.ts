import Clusters from "../state/Clusters"
import {Thunk} from "../state/types"
import {popNotice} from "../components/PopNotice"
import {Cluster} from "../state/Clusters/types"
import ConnectionStatuses from "../state/ConnectionStatuses"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import Investigation from "../state/Investigation"

const removeConnection = (conn: Cluster): Thunk => (
  dispatch,
  _getState,
  {globalDispatch}
) => {
  const {name, id, host, port} = conn

  if (host === "localhost" && port === "9867")
    throw new Error("Cannot remove the default connection")

  dispatch(Current.setSpaceId(null))
  dispatch(Current.setConnectionId(null))
  dispatch(Investigation.clearConnectionInvestigation(id))
  dispatch(Spaces.removeForConnection(id))
  dispatch(ConnectionStatuses.remove(id))
  globalDispatch(Clusters.remove(id))
  popNotice(`Removed connection "${name}"`)
}

export default removeConnection
