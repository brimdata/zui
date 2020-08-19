/* @flow */
import type {Thunk} from "../state/types"
import Current from "../state/Current"
import Tabs from "../state/Tabs"
import refreshSpaceNames from "./refreshSpaceNames"

export default (): Thunk => (dispatch, getState) => {
  const state = getState()
  const space = Current.getSpace(state)
  const spaceId = Current.getSpaceId(state)
  const spaceIsDeleted = spaceId && !space
  if (spaceIsDeleted) dispatch(resetTab())
}

export function resetTab(): Thunk {
  return (dispatch, getState) => {
    const id = Current.getConnectionId(getState())
    dispatch(Tabs.clearActive())
    dispatch(Current.setConnectionId(id))
    dispatch(refreshSpaceNames())
  }
}
