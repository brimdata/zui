import {Thunk} from "../state/types"
import Pools from "../state/Pools"
import {getZealot} from "./getZealot"

export default (
  workspaceId: string,
  poolId: string,
  name: string
): Thunk<Promise<void>> => (dispatch) => {
  const zealot = dispatch(getZealot())

  return zealot.pools.update(poolId, {name}).then(() => {
    dispatch(Pools.rename(workspaceId, poolId, name))
  })
}
