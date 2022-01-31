import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import Current from "../state/Current"
import Investigation from "../state/Investigation"
import Pools from "../state/Pools"
import SystemTest from "../state/SystemTest"
import Handlers from "../state/Handlers"

const deletePool = (poolId: string): Thunk<Promise<void>> => async (
  dispatch,
  getState,
  {api}
) => {
  const zealot = await dispatch(getZealot())
  const lakeId = Current.getWorkspaceId(getState())

  const poolHandler = Object.entries(Handlers.get(getState()))
    .map(([hId, h]) => h.type === "INGEST" && {...h, id: hId})
    .filter(Boolean)
    .find((h) => h.poolId === poolId)

  // if pool is still loading, use brim api to call abort using its handler id
  if (poolHandler) {
    await api.loaders.abort(poolHandler.id)
    // upon abort, loader.load() will throw an error triggering a transaction rollback
    // which will handle the actual delete and cleanup
    return Promise.resolve()
  }

  return zealot.deletePool(poolId).then(() => {
    dispatch(Investigation.clearPoolInvestigation(lakeId, poolId))
    dispatch(Pools.remove({lakeId, poolId}))
    dispatch(SystemTest.hook("pool-deleted"))
  })
}

export default deletePool
