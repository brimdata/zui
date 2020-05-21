/* @flow */
import type {Thunk} from "../state/types"
import Spaces from "../state/Spaces"
import Cluster from "../state/Clusters"
import Tabs from "../state/Tabs"
import Search from "../state/Search"

export default (clusterId: string, spaceId: string, name: string): Thunk => (
  dispatch,
  getState
) => {
  const state = getState()
  const zClient = Cluster.getZealot(clusterId)(state)
  const tabs = Tabs.getData(state)

  zClient.spaces.update(spaceId, {name}).then(() => {
    dispatch(Spaces.rename(clusterId, spaceId, name))
    tabs.forEach((t) => {
      if (t.search.spaceId === spaceId)
        dispatch(Search.setSpace(spaceId, name, t.id))
    })
  })
}
