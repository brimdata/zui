import brim from "../brim"
import Current from "../state/Current"
import Pools from "../state/Pools"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"

export const initPool = (poolId: string): Thunk<Promise<void>> => (
  dispatch,
  getState
) => {
  const workspaceId = Current.getWorkspaceId(getState())
  if (!workspaceId) return
  const zealot = dispatch(getZealot())
  return zealot.pools
    .get(poolId)
    .then(brim.interop.poolPayloadToPool)
    .then((data) => {
      dispatch(Pools.setDetail(workspaceId, data))
    })
    .catch((error) => {
      console.error(error)
    })
}
