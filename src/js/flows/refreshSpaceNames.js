/* @flow */
import type {Thunk} from "../state/types"
import {fetchSpaces} from "../services/boom"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import {globalDispatch} from "../state/GlobalContext"

export default function refreshSpaceNames(): Thunk {
  return (dispatch, getState) => {
    return dispatch(fetchSpaces()).then((spaces) => {
      spaces = spaces || []
      let id = Tab.clusterId(getState())
      globalDispatch(Spaces.setNames(id, spaces))
    })
  }
}
