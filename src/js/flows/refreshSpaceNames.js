/* @flow */
import type {Thunk} from "../state/types"
import {globalDispatch} from "../state/GlobalContext"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"

export default function refreshSpaceNames(): Thunk {
  return (dispatch, getState, {zealot}) => {
    return zealot.spaces.list().then((spaces) => {
      spaces = spaces || []
      let id = Tab.clusterId(getState())
      return globalDispatch(Spaces.setSpaces(id, spaces))
    })
  }
}
