/* @flow */
import type {Thunk} from "../state/types"
import Current from "../state/Current"
import Spaces from "../state/Spaces"

export default function refreshSpaceNames(): Thunk {
  return (dispatch, getState, {createZealot, globalDispatch}) => {
    const zealot = createZealot(Current.getConnectionId(getState()))
    return zealot.spaces.list().then((spaces) => {
      spaces = spaces || []
      let id = Current.getConnectionId(getState())
      if (id) return globalDispatch(Spaces.setSpaces(id, spaces))
    })
  }
}
