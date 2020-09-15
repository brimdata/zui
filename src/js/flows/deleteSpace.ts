import {Thunk} from "../state/types"
import refreshSpaceNames from "./refreshSpaceNames"
import {getZealot} from "./getZealot"
import Current from "../state/Current"
import Investigation from "../state/Investigation"

const deleteSpace = (id: string): Thunk => (dispatch, getState) => {
  const zealot = dispatch(getZealot())
  const clusterId = Current.getConnectionId(getState())
  return zealot.spaces.delete(id).then(() => {
    dispatch(Investigation.clearSpaceInvestigation(clusterId, id))
    dispatch(refreshSpaceNames())
  })
}

export default deleteSpace
