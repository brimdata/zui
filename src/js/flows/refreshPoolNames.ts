import {Thunk} from "../state/types"
import Current from "../state/Current"
import Pools from "../state/Pools"
import {getZealot} from "./getZealot"

export default function refreshPoolNames(): Thunk<Promise<void>> {
  return (dispatch, getState) => {
    const zealot = dispatch(getZealot())
    return zealot.pools.list().then((pools) => {
      pools = pools || []
      const id = Current.getWorkspaceId(getState())
      if (id) dispatch(Pools.setPools(id, pools))
    })
  }
}
