/* @flow */
import type {Thunk} from "../state/types"
import {globalDispatch} from "../state/GlobalContext"
import Current from "../state/Current"
import Spaces from "../state/Spaces"

export default function refreshSpaceInfo(): Thunk {
  return () => (dispatch, getState, {createZealot}) => {
    const zealot = createZealot(Current.getConnectionId(getState()))
    const id = Current.getSpaceId(getState())

    return zealot.spaces.get(id).then((data: *) => {
      let id = Current.getConnectionId(getState())
      if (!id) return
      globalDispatch(Spaces.setDetail(id, data))
    })
  }
}
