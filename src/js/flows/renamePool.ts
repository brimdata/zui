import {syncPool} from "src/app/core/pools/sync-pool"
import {Thunk} from "../state/types"

export default (poolId: string, name: string): Thunk<Promise<void>> =>
  async (dispatch, gs, {api}) => {
    const zealot = await api.getZealot()
    await zealot.updatePool(poolId, {name})
    await dispatch(syncPool(poolId))
  }
