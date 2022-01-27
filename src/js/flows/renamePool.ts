import {Thunk} from "../state/types"
import Pools from "../state/Pools"
import {getZealot} from "./getZealot"
import syncPools from "app/core/pools/sync-pools"
import {syncPool} from "app/core/pools/sync-pool"

export default (
  lakeId: string,
  poolId: string,
  name: string
): Thunk<Promise<void>> => (dispatch) => {
  const zealot = dispatch(getZealot())

  return zealot.updatePool(poolId, {name}).then(() => {
    return dispatch(syncPool(poolId))
  })
}
