import {syncPool} from "app/core/pools/sync-pool"
import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"

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
