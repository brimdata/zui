import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import Current from "../state/Current"
import Investigation from "../state/Investigation"
import Pools from "../state/Pools"
import SystemTest from "../state/SystemTest"

const deletePool = (id: string): Thunk<Promise<void>> => (
  dispatch,
  getState
) => {
  const zealot = dispatch(getZealot())
  const workspaceId = Current.getWorkspaceId(getState())
  return zealot.pools.delete(id).then(() => {
    dispatch(Investigation.clearPoolInvestigation(workspaceId, id))
    dispatch(Pools.remove(workspaceId, id))
    dispatch(SystemTest.hook("pool-deleted"))
  })
}

export default deletePool
