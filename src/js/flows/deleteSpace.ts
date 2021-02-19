import {Thunk} from "../state/types"
import {getZealot} from "./getZealot"
import Current from "../state/Current"
import Investigation from "../state/Investigation"
import Spaces from "../state/Spaces"

const deleteSpace = (id: string): Thunk<Promise<void>> => (
  dispatch,
  getState
) => {
  const zealot = dispatch(getZealot())
  const workspaceId = Current.getWorkspaceId(getState())
  return zealot.spaces.delete(id).then(() => {
    dispatch(Investigation.clearSpaceInvestigation(workspaceId, id))
    dispatch(Spaces.remove(workspaceId, id))
  })
}

export default deleteSpace
