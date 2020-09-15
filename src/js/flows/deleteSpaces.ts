import {Thunk} from "../state/types"
import refreshSpaceNames from "./refreshSpaceNames"
import {getZealot} from "./getZealot"
import Current from "../state/Current"
import Investigation from "../state/Investigation"

const deleteSpaces = (ids: string[]): Thunk => (dispatch, getState) => {
  const zealot = dispatch(getZealot())
  const clusterId = Current.getConnectionId(getState())
  return Promise.all(
    ids.map((id) => {
      return zealot.spaces
        .delete(id)
        .then(() => {
          dispatch(Investigation.clearSpaceInvestigation(clusterId, id))
        })
        .catch((e) => {
          throw new Error(
            `Unable to delete spaceId (${id}): ${JSON.stringify(e)}`
          )
        })
    })
  ).then(() => {
    dispatch(refreshSpaceNames())
  })
}

export default deleteSpaces
