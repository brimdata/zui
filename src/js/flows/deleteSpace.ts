import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import Current from "../state/Current"
import Investigation from "../state/Investigation"
import Spaces from "../state/Spaces"

const deleteSpace = (id: string): Thunk => (
  dispatch,
  getState,
  {globalDispatch}
) => {
  const zealot = dispatch(getZealot())
  const clusterId = Current.getConnectionId(getState())
  return zealot.spaces.delete(id).then(() => {
    globalDispatch(Investigation.clearSpaceInvestigation(clusterId, id))
    globalDispatch(Spaces.remove(clusterId, id))
  })
}

export default deleteSpace
