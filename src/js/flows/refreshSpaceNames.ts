import {Thunk} from "../state/types"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import {getZealot} from "./getZealot"

export default function refreshSpaceNames(): Thunk<Promise<void>> {
  return (dispatch, getState, {globalDispatch}) => {
    const zealot = dispatch(getZealot())
    return zealot.spaces.list().then((spaces) => {
      spaces = spaces || []
      const id = Current.getConnectionId(getState())
      if (id) globalDispatch(Spaces.setSpaces(id, spaces))
    })
  }
}
