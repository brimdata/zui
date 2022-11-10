import {Thunk} from "../state/types"
import Current from "../state/Current"
import Investigation from "../state/Investigation"
import Pools from "../state/Pools"

export const deleteOnePool =
  (poolId: string): Thunk<Promise<void>> =>
  async (dispatch, getState, {api}) => {
    const zealot = await api.getZealot()
    const lakeId = Current.getLakeId(getState())

    return zealot.deletePool(poolId).then(() => {
      dispatch(Investigation.clearPoolInvestigation(lakeId, poolId))
      dispatch(Pools.remove({lakeId, poolId}))
    })
  }
