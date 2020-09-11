import Current from "../state/Current"
import Clusters from "../state/Clusters"
import {Cluster} from "../state/Clusters/types"
import refreshSpaceNames from "./refreshSpaceNames"
import {globalDispatch} from "../state/GlobalContext"

export const setConnection = (cluster: Cluster) => (
  dispatch,
  getState,
  {createZealot}
): Promise<void> => {
  const zealot = createZealot(cluster.id)
  return zealot
    .status()
    .then(() => {
      dispatch(Clusters.add(cluster))
      globalDispatch(Clusters.add(cluster)).then(() => {
        dispatch(Current.setConnectionId(cluster.id))
        dispatch(refreshSpaceNames())
      })
    })
    .catch((e) => {
      throw new Error(`Cannot connect to ${cluster.id}: ${e.message}`)
    })
}
