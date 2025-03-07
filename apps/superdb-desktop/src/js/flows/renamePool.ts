import {syncPool} from "src/models/sync-pool"
import {Thunk} from "../state/types"

export default (poolId: string, name: string): Thunk<Promise<void>> =>
  async (dispatch, gs, {api}) => {
    const zealot = await api.getZealot()
    try {
      await zealot.updatePool(poolId, {name})
    } catch (e) {
      if (e instanceof Error) {
        api.toast.error(e.message)
      }
    }
    await dispatch(syncPool(poolId))
  }
