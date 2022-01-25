import {Thunk} from "../state/types"
import Pools from "../state/Pools"
import {getZealot} from "./getZealot"

export default (
  lakeId: string,
  poolId: string,
  name: string
): Thunk<Promise<void>> => (dispatch) => {
  const zealot = dispatch(getZealot())

  return zealot.updatePool(poolId, {name}).then(() => {
    dispatch(Pools.rename(lakeId, poolId, name))
  })
}
