import {Thunk} from "../state/types"
import Current from "../state/Current"
import Investigation from "../state/Investigation"
import Pools from "../state/Pools"
import Loads from "../state/Loads"

export const deleteOnePool =
  (poolId: string): Thunk<Promise<void>> =>
  async (dispatch, getState, {api}) => {
    const zealot = await api.getZealot()
    const lakeId = Current.getLakeId(getState())

    // Abort any ingests
    const loads = Loads.all(getState()).filter((l) => l.poolId === poolId)

    for (let {id} of loads) {
      api.abortables.abort({id})
    }

    return zealot.deletePool(poolId).then(() => {
      dispatch(Investigation.clearPoolInvestigation(lakeId, poolId))
      dispatch(Pools.remove({lakeId, poolId}))
    })
  }
