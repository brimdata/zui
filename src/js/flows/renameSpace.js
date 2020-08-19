/* @flow */
import type {Thunk} from "../state/types"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import Tabs from "../state/Tabs"

export default (clusterId: string, spaceId: string, name: string): Thunk => (
  dispatch,
  getState,
  {createZealot}
) => {
  const state = getState()
  const zealot = createZealot(Current.getConnectionId(state))
  const tabs = Tabs.getData(state)

  return zealot.spaces.update(spaceId, {name}).then(() => {
    dispatch(Spaces.rename(clusterId, spaceId, name))
    tabs.forEach((t) => {
      if (t.current.spaceId === spaceId)
        dispatch(Current.setSpaceId(spaceId, t.id))
    })
  })
}
