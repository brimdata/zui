/* @flow */
import type {Thunk} from "../state/types"
import Current from "../state/Current"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import refreshSpaceNames from "./refreshSpaceNames"

export default (): Thunk => (dispatch, getState) => {
  const state = getState()
  const space = Tab.space(state)
  const spaceId = Tab.getSpaceId(state)
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
