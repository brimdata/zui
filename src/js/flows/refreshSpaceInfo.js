/* @flow */
import type {Thunk} from "../state/types"
import {globalDispatch} from "../state/GlobalContext"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"

export default function refreshSpaceInfo(): Thunk {
  return () => (dispatch, getState, {zealot}) => {
    const id = Tab.getSpaceId(getState())

    return zealot.spaces.get(id).then((data: *) => {
      let id = Tab.clusterId(getState())
      globalDispatch(Spaces.setDetail(id, data))
    })
  }
}
