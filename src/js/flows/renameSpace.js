/* @flow */
import type {Thunk} from "../state/types"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import Tabs from "../state/Tabs"

export default (clusterId: string, spaceId: string, name: string): Thunk => (
  dispatch,
  getState,
  {zealot}
) => {
  const state = getState()
  const tabs = Tabs.getData(state)

  return zealot.spaces.update(spaceId, {name}).then(() => {
    dispatch(Spaces.rename(clusterId, spaceId, name))
    tabs.forEach((t) => {
      if (t.search.spaceId === spaceId)
        dispatch(Current.setSpaceId(spaceId, t.id))
    })
  })
}
