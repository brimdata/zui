/* @flow */
import type {Thunk} from "../state/types"
import {globalDispatch} from "../state/GlobalContext"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"

export default function refreshSpaceInfo(): Thunk {
  return () => (dispatch, getState, {zealot}) => {
    const id = Current.getSpaceId(getState())

    return zealot.spaces.get(id).then((data: *) => {
      let id = Current.getConnectionId(getState())
      if (!id) return
      globalDispatch(Spaces.setDetail(id, data))
    })
  }
}
