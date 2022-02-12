import {syncPool} from "app/core/pools/sync-pool"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"

export default (poolId: string, name: string): Thunk<Promise<void>> => async (
  dispatch
) => {
  const zealot = await dispatch(getZealot())
  await zealot.updatePool(poolId, {name})
  await dispatch(syncPool(poolId))
}
