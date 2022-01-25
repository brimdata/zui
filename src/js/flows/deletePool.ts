import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import Current from "../state/Current"
import Investigation from "../state/Investigation"
import Pools from "../state/Pools"
import SystemTest from "../state/SystemTest"
import Handlers from "../state/Handlers"

const deletePool = (id: string): Thunk<Promise<void>> => async (
  dispatch,
  getState,
  {api}
) => {
  const zealot = dispatch(getZealot())
  const workspaceId = Current.getWorkspaceId(getState())

  const poolHandler = Object.entries(Handlers.get(getState()))
    .map(([hId, h]) => h.type === "INGEST" && {...h, id: hId})
    .filter(Boolean)
    .find((h) => h.poolId === id)

  // if pool is still loading, use brim api to call abort using its handler id
  if (poolHandler) {
    await api.loaders.abort(poolHandler.id)
    // upon abort, loader.load() will throw an error triggering a transaction rollback
    // which will handle the actual delete and cleanup
    return Promise.resolve()
  }

  return zealot.deletePool(id).then(() => {
    dispatch(Investigation.clearPoolInvestigation(workspaceId, id))
    dispatch(Pools.remove(workspaceId, id))
    dispatch(SystemTest.hook("pool-deleted"))
  })
}

export default deletePool
